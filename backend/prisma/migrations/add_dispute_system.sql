-- 游戏质疑记录表
CREATE TABLE IF NOT EXISTS "GameDispute" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameDispute_pkey" PRIMARY KEY ("id")
);

-- 仲裁请求表
CREATE TABLE IF NOT EXISTS "ArbitrationRequest" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "handlerId" TEXT,
    "handlerResponse" TEXT,
    "handledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArbitrationRequest_pkey" PRIMARY KEY ("id")
);

-- 添加外键约束
ALTER TABLE "GameDispute" ADD CONSTRAINT "GameDispute_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "BetGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GameDispute" ADD CONSTRAINT "GameDispute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArbitrationRequest" ADD CONSTRAINT "ArbitrationRequest_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "BetGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArbitrationRequest" ADD CONSTRAINT "ArbitrationRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArbitrationRequest" ADD CONSTRAINT "ArbitrationRequest_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 创建唯一索引，防止重复质疑
CREATE UNIQUE INDEX "GameDispute_gameId_userId_key" ON "GameDispute"("gameId", "userId");

-- 创建索引优化查询
CREATE INDEX "GameDispute_gameId_idx" ON "GameDispute"("gameId");
CREATE INDEX "ArbitrationRequest_gameId_idx" ON "ArbitrationRequest"("gameId");
CREATE INDEX "ArbitrationRequest_status_idx" ON "ArbitrationRequest"("status");
CREATE INDEX "ArbitrationRequest_handlerId_idx" ON "ArbitrationRequest"("handlerId");

-- 添加游戏状态枚举值（如果需要）
-- ALTER TYPE "GameStatus" ADD VALUE 'DISPUTED';
-- ALTER TYPE "GameStatus" ADD VALUE 'UNDER_ARBITRATION';
