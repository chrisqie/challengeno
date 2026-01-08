-- =====================================================
-- 修复争议截止时间
-- =====================================================
-- 问题：之前的迁移脚本错误地设置了 dispute_submission_deadline
-- 导致所有游戏的争议提交截止时间都是过去的时间
-- =====================================================

-- 1. 查看当前有问题的游戏
SELECT 
  id,
  title,
  status,
  created_at,
  dispute_submission_deadline,
  arbitration_deadline,
  CASE 
    WHEN dispute_submission_deadline < NOW() THEN '已过期'
    ELSE '未过期'
  END as deadline_status
FROM bet_games
WHERE status IN ('COMPLETED', 'DISPUTED')
  AND dispute_submission_deadline IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- 修复方案：
-- 对于 COMPLETED 和 DISPUTED 状态的游戏：
-- - dispute_submission_deadline = updated_at + 48小时
-- - arbitration_deadline = updated_at + 120小时
-- 
-- 注意：updated_at 通常是游戏进入 COMPLETED 状态的时间
-- =====================================================

-- 2. 修复所有 COMPLETED 和 DISPUTED 游戏的截止时间
UPDATE bet_games
SET 
  dispute_submission_deadline = updated_at + INTERVAL '48 hours',
  arbitration_deadline = updated_at + INTERVAL '120 hours'
WHERE status IN ('COMPLETED', 'DISPUTED')
  AND dispute_submission_deadline IS NOT NULL;

-- 3. 验证修复结果
SELECT 
  id,
  title,
  status,
  created_at,
  updated_at,
  dispute_submission_deadline,
  arbitration_deadline,
  CASE 
    WHEN dispute_submission_deadline > NOW() THEN '✅ 未过期'
    ELSE '❌ 已过期'
  END as submission_status,
  CASE 
    WHEN arbitration_deadline > NOW() THEN '✅ 未过期'
    ELSE '❌ 已过期'
  END as arbitration_status,
  EXTRACT(EPOCH FROM (dispute_submission_deadline - NOW())) / 3600 as hours_until_submission_deadline,
  EXTRACT(EPOCH FROM (arbitration_deadline - NOW())) / 3600 as hours_until_arbitration_deadline
FROM bet_games
WHERE status IN ('COMPLETED', 'DISPUTED')
  AND dispute_submission_deadline IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- 完成！
-- =====================================================

