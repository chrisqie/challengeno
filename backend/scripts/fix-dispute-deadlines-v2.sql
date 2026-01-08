-- =====================================================
-- 修复争议截止时间 V2（更精确的版本）
-- =====================================================
-- 使用 review_deadline 作为基准时间
-- 因为游戏在互评结束后才进入 COMPLETED 状态
-- =====================================================

-- 1. 查看当前游戏的时间字段
SELECT 
  id,
  title,
  status,
  end_date,
  evidence_deadline,
  review_deadline,
  dispute_submission_deadline,
  arbitration_deadline,
  updated_at
FROM bet_games
WHERE status IN ('COMPLETED', 'DISPUTED')
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- 修复方案：
-- 使用 review_deadline 作为游戏完成的基准时间
-- - dispute_submission_deadline = review_deadline + 48小时
-- - arbitration_deadline = review_deadline + 120小时
-- =====================================================

-- 2. 修复所有游戏的截止时间
UPDATE bet_games
SET 
  dispute_submission_deadline = review_deadline + INTERVAL '48 hours',
  arbitration_deadline = review_deadline + INTERVAL '120 hours'
WHERE status IN ('COMPLETED', 'DISPUTED')
  AND review_deadline IS NOT NULL;

-- 3. 对于没有 review_deadline 的游戏，使用 evidence_deadline
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
  title,
  status,
  review_deadline as game_completed_at,
  dispute_submission_deadline,
  arbitration_deadline,
  CASE 
    WHEN dispute_submission_deadline > NOW() THEN '✅ 可提交争议'
    ELSE '❌ 提交期已过'
  END as submission_status,
  CASE 
    WHEN arbitration_deadline > NOW() THEN '✅ 仲裁期内'
    ELSE '❌ 仲裁期已过'
  END as arbitration_status,
  ROUND(EXTRACT(EPOCH FROM (dispute_submission_deadline - NOW())) / 3600, 1) as hours_until_submission_deadline,
  ROUND(EXTRACT(EPOCH FROM (arbitration_deadline - NOW())) / 3600, 1) as hours_until_arbitration_deadline
FROM bet_games
WHERE status IN ('COMPLETED', 'DISPUTED')
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- 完成！
-- =====================================================

