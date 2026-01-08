#!/bin/bash

# 更新消息功能的脚本

echo "🔄 开始更新消息功能..."

# 1. 生成Prisma客户端
echo "📦 生成Prisma客户端..."
npx prisma generate

# 2. 推送数据库变更
echo "🗄️  推送数据库变更..."
npx prisma db push --accept-data-loss

# 3. 构建后端
echo "🔨 构建后端..."
npm run build

echo "✅ 更新完成！"
echo "请运行: pm2 restart bet-together"

