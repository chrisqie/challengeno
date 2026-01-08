# Resend 邮件服务配置指南

## 📧 什么是 Resend？

Resend 是一个现代化的邮件发送服务，专为开发者设计，简单易用。

官网: https://resend.com

---

## 🔧 配置步骤

### 1. 在 .env 文件中添加配置

编辑 `/opt/bet-together/backend/.env`，添加以下配置：

```bash
# Resend 邮件服务配置
RESEND_API_KEY=E96CLEGLNSNA2KFVLDUWN9HP
EMAIL_FROM_DOMAIN=yesfreedom.news
EMAIL_FROM_NAME=BetTogether
FRONTEND_URL=http://142.171.117.89
```

**说明**：
- `RESEND_API_KEY`: 你的 Resend API Key
- `EMAIL_FROM_DOMAIN`: 发件域名（需要在 Resend 控制台验证）
- `EMAIL_FROM_NAME`: 发件人名称
- `FRONTEND_URL`: 前端地址（用于生成密码重置链接）

---

### 2. 安装依赖

```bash
cd /opt/bet-together/backend
npm install resend
```

---

### 3. 测试 API Key

```bash
cd /opt/bet-together/backend
node scripts/test-resend.js
```

**预期输出**：
```
🔍 开始测试 Resend API Key...

✅ API Key 已找到: E96CLEGLNS...N9HP
   长度: 24 字符

📧 发件人配置: BetTogether <noreply@yesfreedom.news>

📤 正在发送测试邮件...

✅ 测试邮件发送成功！
   邮件 ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

📬 测试邮件已发送到: delivered@resend.dev
   这是 Resend 提供的测试邮箱，不会真实投递

🎉 Resend API Key 配置正确，可以正常使用！
```

---

### 4. 验证域名（重要！）

要向真实邮箱发送邮件，需要在 Resend 控制台验证域名：

1. 访问: https://resend.com/domains
2. 添加你的域名（例如：`yesfreedom.news`）
3. 按照提示添加 DNS 记录（SPF、DKIM、DMARC）
4. 等待验证通过（通常几分钟到几小时）

**DNS 记录示例**：
```
类型: TXT
主机: @
值: v=spf1 include:_spf.resend.com ~all

类型: TXT
主机: resend._domainkey
值: (Resend 提供的 DKIM 值)
```

---

## 🧪 测试邮件功能

### 方法1：使用测试脚本

```bash
node scripts/test-resend.js
```

### 方法2：使用 API 端点

```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "your-email@example.com",
    "type": "welcome",
    "data": {
      "username": "TestUser"
    }
  }'
```

---

## 📝 支持的邮件类型

当前系统支持以下邮件类型：

1. **欢迎邮件** (`welcome`)
   - 用户注册时自动发送

2. **好友请求** (`friend_request`)
   - 有人发送好友请求时

3. **游戏邀请** (`game_invite`)
   - 被邀请参加游戏时

4. **游戏状态更新** (`game_status`)
   - 游戏状态变更时

5. **密码重置** (`password_reset`)
   - 用户请求重置密码时

---

## ❓ 常见问题

### Q1: 测试邮件发送成功，但真实邮箱收不到？

**A**: 需要验证域名。未验证的域名只能发送到 `delivered@resend.dev`。

### Q2: API Key 无效？

**A**: 检查以下几点：
- API Key 是否正确复制（没有多余空格）
- API Key 是否已过期
- 在 Resend 控制台检查 API Key 状态

### Q3: 邮件进入垃圾箱？

**A**: 完成域名验证后，添加 SPF、DKIM、DMARC 记录可以提高送达率。

### Q4: 发送频率限制？

**A**: Resend 免费版有发送限制：
- 每天 100 封邮件
- 每月 3,000 封邮件
- 如需更多，升级到付费版

---

## 🔗 相关链接

- Resend 官网: https://resend.com
- Resend 文档: https://resend.com/docs
- API Keys 管理: https://resend.com/api-keys
- 域名验证: https://resend.com/domains
- 发送日志: https://resend.com/emails

---

## 📞 需要帮助？

如果遇到问题，请提供以下信息：
1. 测试脚本的完整输出
2. .env 文件中的配置（隐藏敏感信息）
3. 错误信息截图

