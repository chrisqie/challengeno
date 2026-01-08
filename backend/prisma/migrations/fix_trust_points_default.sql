-- 修复信任积分默认值问题
-- 将所有信任积分为100的新用户（可能是默认值）重置为10

-- 1. 更新默认值为100且没有完成任何游戏的用户（很可能是新用户）
UPDATE users
SET trust_points = 10
WHERE trust_points = 100
  AND games_completed = 0
  AND total_games_created = 0
  AND total_games_joined = 0;

-- 2. 更新表结构默认值
ALTER TABLE users ALTER COLUMN trust_points SET DEFAULT 10;

-- 验证更新结果
-- SELECT username, trust_points, games_completed, total_games_created, total_games_joined
-- FROM users
-- WHERE trust_points = 10;
