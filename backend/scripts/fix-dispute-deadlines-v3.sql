-- =====================================================
-- 修复争议截止时间 V3（强制更新所有游戏）
-- =====================================================
-- 问题：之前的迁移脚本错误地计算了截止时间
-- 解决：使用 review_deadline 作为基准，重新计算所有截止时间
-- =====================================================

-- 1. 查看当前游戏的时间字段和状态
SELECT 
  id,
  LEFT(title, 20) as title,
  status,
  review_deadline as game_completed_at,
  dispute_submission_deadline,
  arbitration_deadline,
  NOW() as current_time,
  CASE 
    WHEN dispute_submission_deadline > NOW() THEN '✅'
    ELSE '❌'
  END as can_submit
FROM bet_games
WHERE status IN ('COMPLETED', 'DISPUTED')
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- 强制更新所有游戏的截止时间
-- =====================================================

-- 2. 对于有 review_deadline 的游戏
UPDATE bet_games
SET 
  dispute_submission_deadline = review_deadline + INTERVAL '48 hours',
  arbitration_deadline = review_deadline + INTERVAL '120 hours'
WHERE status IN ('COMPLETED', 'DISPUTED')
  AND review_deadline IS NOT NULL;

-- 3. 对于没有 review_deadline 但有 evidence_deadline 的游戏
UPDATE bet_games
SET 
  dispute_submission_deadline = evidence_deadline + INTERVAL '48 hours',
  arbitration_deadline = evidence_deadline + INTERVAL '120 hours'
WHERE status IN ('COMPLETED', 'DISPUTED')
  AND review_deadline IS NULL
  AND evidence_deadline IS NOT NULL;

-- 4. 验证修复结果
SELECT 
  id,
  LEFT(title, 25) as title,
  status,
  review_deadline as completed_at,
  dispute_submission_deadline,
  arbitration_deadline,
  CASE 
    WHEN dispute_submission_deadline > NOW() THEN '✅ 可提交'
    ELSE '❌ 已过期'
  END as submission_status,
  ROUND(EXTRACT(EPOCH FROM (dispute_submission_deadline - NOW())) / 3600, 1) as hours_left
FROM bet_games
WHERE status IN ('COMPLETED', 'DISPUTED')
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- 完成！
-- =====================================================

