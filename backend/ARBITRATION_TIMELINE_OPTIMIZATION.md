# 仲裁时间线优化方案

## 📋 问题分析

### 当前问题
1. ❌ 用户可以在48小时内**随时**提交争议
2. ❌ 管理员可能在第1小时就处理了第一个争议
3. ❌ 第47小时另一个用户提交新证据，管理员又要重新判断
4. ❌ 积分反复加减，混乱

### 根本原因
- 用户提交争议的截止时间 = 管理员处理争议的截止时间
- 管理员无法等待所有用户提交完证据后再做综合判断

---

## ✅ 优化方案

### 新的时间线设计

```
游戏完成 (COMPLETED)
    ↓
    ├─ 0-48小时：用户争议提交窗口期
    │  - 用户可以发起争议
    │  - 用户可以提交证据
    │  - 管理员**不处理**，只收集信息
    │  - 截止时间：disputeSubmissionDeadline
    ↓
48小时：争议提交窗口关闭
    ↓
    ├─ 48-120小时：管理员仲裁处理期（72小时）
    │  - 用户**不能**再提交新争议
    │  - 管理员审查所有争议和证据
    │  - 管理员做出最终裁决
    │  - 截止时间：arbitrationDeadline
    ↓
120小时：仲裁期结束
    ↓
游戏归档 (CLOSED)
```

### 时间字段说明

| 字段 | 说明 | 计算方式 | 用途 |
|------|------|----------|------|
| `disputeSubmissionDeadline` | 用户提交争议截止时间 | 游戏完成时间 + 48小时 | 用户提交争议的最后期限 |
| `arbitrationDeadline` | 管理员仲裁截止时间 | 游戏完成时间 + 120小时 | 管理员处理争议的最后期限 |

---

## 🔧 技术实现

### 1. 数据库 Schema 修改

**文件**: `backend/prisma/schema.prisma`

```prisma
model BetGame {
  // ... 其他字段
  
  disputeSubmissionDeadline DateTime? @map("dispute_submission_deadline") // 用户提交争议截止时间（完成后48小时）
  arbitrationDeadline       DateTime? @map("arbitration_deadline")         // 管理员仲裁截止时间（争议提交截止后72小时）
}
```

### 2. 数据库迁移

**文件**: `backend/prisma/migrations/add_dispute_submission_deadline/migration.sql`

- 添加 `dispute_submission_deadline` 字段
- 更新现有数据的时间字段

### 3. 游戏结算服务修改

**文件**: `backend/src/games/game-settlement.service.ts`

修改两处设置截止时间的代码：

```typescript
// 用户提交争议截止时间：48小时
const disputeSubmissionDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);
// 管理员仲裁截止时间：争议提交截止后72小时（总共120小时）
const arbitrationDeadline = new Date(now.getTime() + 120 * 60 * 60 * 1000);

await this.prisma.betGame.update({
  where: { id: gameId },
  data: {
    status: GameStatus.COMPLETED,
    disputeSubmissionDeadline,
    arbitrationDeadline,
  },
});
```

### 4. 争议服务修改

**文件**: `backend/src/disputes/disputes.service.ts`

修改争议创建时的期限检查：

```typescript
// 检查是否在争议提交期限内（用户只能在48小时内提交争议）
if (game.status === 'COMPLETED' || game.status === 'DISPUTED') {
  if (game.disputeSubmissionDeadline) {
    const now = new Date();
    if (now > game.disputeSubmissionDeadline) {
      throw new BadRequestException('争议提交期限已过（游戏完成后48小时内），无法发起新的争议');
    }
  }
}
```

### 5. 前端显示修改

**文件**: `frontend/src/pages/GameDetailPage.tsx`

需要修改的地方：

1. **争议提交按钮** (第793-823行)
   - 使用 `disputeSubmissionDeadline` 而不是 `arbitrationDeadline`
   - 显示"争议提交期限"而不是"仲裁期限"

2. **时间流程显示** (第911-920行)
   - 添加"争议提交截止"时间显示
   - 保留"管理员仲裁截止"时间显示

3. **仲裁阶段说明** (第1237-1253行)
   - 更新文案，区分"用户提交期"和"管理员处理期"

---

## 📝 用户体验优化

### 前端文案建议

#### 1. 游戏完成后（0-48小时）
```
✅ 游戏已完成
⏰ 争议提交期：还剩 XX 小时
💡 提示：如对结果有异议，请在48小时内提交争议
```

#### 2. 争议提交期结束后（48-120小时）
```
✅ 争议提交期已结束
⚖️ 管理员仲裁中：预计 XX 小时内处理完成
💡 提示：管理员正在综合所有证据做出最终裁决
```

#### 3. 仲裁期结束后（120小时+）
```
✅ 游戏已归档
🏆 最终结果：[成功/失败]
```

---

## 🎯 预期效果

### 解决的问题
1. ✅ 用户有明确的48小时提交争议窗口
2. ✅ 管理员在所有争议提交后再处理，避免重复判断
3. ✅ 积分只在最终裁决时调整一次，不会反复加减
4. ✅ 流程更清晰，用户体验更好

### 技术优势
1. ✅ 数据库字段明确，语义清晰
2. ✅ 兼容旧数据（通过迁移脚本）
3. ✅ 前后端逻辑一致
4. ✅ 易于维护和扩展

---

## 📋 部署清单

### 后端文件（5个）
1. `backend/prisma/schema.prisma` - 添加 disputeSubmissionDeadline 字段
2. `backend/prisma/migrations/add_dispute_submission_deadline/migration.sql` - 数据库迁移
3. `backend/src/games/game-settlement.service.ts` - 设置正确的截止时间
4. `backend/src/disputes/disputes.service.ts` - 检查争议提交期限
5. `backend/scripts/clean-dispute-evidence-base64.sql` - 清理 base64 数据（额外任务）

### 前端文件（1个）
1. `frontend/src/pages/GameDetailPage.tsx` - 显示正确的时间和文案

### 部署步骤
1. 上传所有文件到服务器
2. 运行数据库迁移：`psql -U bet_user -d bet_together -f backend/prisma/migrations/add_dispute_submission_deadline/migration.sql`
3. 重新生成 Prisma Client：`npx prisma generate`
4. 重新构建后端：`npm run build`
5. 重启服务：`pm2 restart bet-together`
6. 构建前端：`cd frontend && npm run build`
7. 重启前端服务

---

## ⚠️ 注意事项

1. **兼容性**：迁移脚本会自动处理现有数据
2. **测试**：部署后需要测试完整的争议流程
3. **文档**：需要更新用户帮助文档，说明新的时间规则
4. **通知**：可以考虑在争议提交期即将结束时发送提醒通知

---

## 🔮 未来优化方向

1. **自动提醒**：在争议提交期剩余12小时时，向相关用户发送提醒
2. **管理员工作台**：在管理后台显示"待处理争议"列表，只在争议提交期结束后显示
3. **统计分析**：记录争议提交时间分布，优化时间窗口设置
4. **灵活配置**：允许管理员调整时间窗口（48小时/72小时可配置）

