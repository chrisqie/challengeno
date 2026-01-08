-- AlterTable: 添加争议提交截止时间字段
ALTER TABLE "bet_games" ADD COLUMN "dispute_submission_deadline" TIMESTAMP(3);

-- 更新现有数据：为已完成的游戏设置争议提交截止时间
-- 规则：如果游戏已经有 arbitration_deadline，则 dispute_submission_deadline = arbitration_deadline - 72小时
UPDATE "bet_games"
SET "dispute_submission_deadline" = "arbitration_deadline" - INTERVAL '72 hours'
WHERE "arbitration_deadline" IS NOT NULL
  AND "dispute_submission_deadline" IS NULL;

-- 更新现有数据：调整 arbitration_deadline
-- 规则：arbitration_deadline = dispute_submission_deadline + 72小时
UPDATE "bet_games"
SET "arbitration_deadline" = "dispute_submission_deadline" + INTERVAL '72 hours'
WHERE "dispute_submission_deadline" IS NOT NULL
  AND "arbitration_deadline" IS NOT NULL;

