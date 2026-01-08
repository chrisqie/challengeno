-- ========================================
-- 清除数据库中所有 base64 编码的图片数据
-- 执行前请确保已经备份数据库！
-- ========================================

-- 1. 查看争议证据表中的 base64 记录
SELECT
  '争议证据 (dispute_evidence)' as table_name,
  COUNT(*) as base64_count,
  SUM(LENGTH(content)) / 1024 / 1024 as total_size_mb
FROM dispute_evidence
WHERE content LIKE 'data:image/%' OR content LIKE 'data:video/%' OR content LIKE 'data:application/%';

-- 2. 查看参与者证据表中的 base64 记录
SELECT
  '参与者证据 (bet_participants)' as table_name,
  COUNT(*) as base64_count,
  SUM(LENGTH(evidence_content)) / 1024 / 1024 as total_size_mb
FROM bet_participants
WHERE evidence_content LIKE 'data:image/%' OR evidence_content LIKE 'data:video/%' OR evidence_content LIKE 'data:application/%';

-- 3. 查看用户头像表中的 base64 记录
SELECT
  '用户头像 (users)' as table_name,
  COUNT(*) as base64_count,
  SUM(LENGTH(avatar)) / 1024 / 1024 as total_size_mb
FROM users
WHERE avatar LIKE 'data:image/%';

-- ========================================
-- 开始清理（请确认上面的统计结果后再执行）
-- ========================================

-- 4. 删除争议证据表中的 base64 记录
DELETE FROM dispute_evidence
WHERE content LIKE 'data:image/%'
   OR content LIKE 'data:video/%'
   OR content LIKE 'data:application/%';

-- 5. 清空参与者证据表中的 base64 数据（设为 NULL）
UPDATE bet_participants
SET evidence_content = NULL,
    evidence_submitted = false,
    evidence_submitted_at = NULL
WHERE evidence_content LIKE 'data:image/%'
   OR evidence_content LIKE 'data:video/%'
   OR evidence_content LIKE 'data:application/%';

-- 6. 清空用户头像表中的 base64 数据（设为 NULL）
UPDATE users
SET avatar = NULL
WHERE avatar LIKE 'data:image/%';

-- ========================================
-- 验证清理结果
-- ========================================

-- 7. 验证争议证据表
SELECT
  '争议证据 (dispute_evidence)' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN content LIKE 'data:%' THEN 1 END) as base64_remaining
FROM dispute_evidence;

-- 8. 验证参与者证据表
SELECT
  '参与者证据 (bet_participants)' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN evidence_content LIKE 'data:%' THEN 1 END) as base64_remaining
FROM bet_participants;

-- 9. 验证用户头像表
SELECT
  '用户头像 (users)' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN avatar LIKE 'data:%' THEN 1 END) as base64_remaining
FROM users;

-- ========================================
-- 完成！
-- ========================================

