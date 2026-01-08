-- 为现有用户添加位置信息的SQL脚本

-- 首先检查有多少用户没有位置信息
SELECT 
  COUNT(*) as users_without_location
FROM users 
WHERE country IS NULL OR city IS NULL;

-- 为用户添加示例位置信息
-- 注意：这里使用随机分配，实际应用中应该根据用户的真实位置设置

-- 为前几个用户设置不同的位置
UPDATE users 
SET 
  country = '中国',
  country_code = 'CN',
  city = '北京'
WHERE id IN (
  SELECT id FROM users 
  WHERE country IS NULL OR city IS NULL 
  ORDER BY created_at 
  LIMIT 3
);

UPDATE users 
SET 
  country = '中国',
  country_code = 'CN',
  city = '上海'
WHERE id IN (
  SELECT id FROM users 
  WHERE country IS NULL OR city IS NULL 
  ORDER BY created_at 
  LIMIT 3
);

UPDATE users 
SET 
  country = '韩国',
  country_code = 'KR',
  city = '首尔'
WHERE id IN (
  SELECT id FROM users 
  WHERE country IS NULL OR city IS NULL 
  ORDER BY created_at 
  LIMIT 2
);

UPDATE users 
SET 
  country = '日本',
  country_code = 'JP',
  city = '东京'
WHERE id IN (
  SELECT id FROM users 
  WHERE country IS NULL OR city IS NULL 
  ORDER BY created_at 
  LIMIT 2
);

-- 为剩余用户设置默认位置
UPDATE users 
SET 
  country = '中国',
  country_code = 'CN',
  city = '深圳'
WHERE country IS NULL OR city IS NULL;

-- 验证结果
SELECT 
  username,
  city,
  country,
  country_code
FROM users 
WHERE country IS NOT NULL AND city IS NOT NULL
ORDER BY created_at;

-- 检查还有多少用户没有位置信息
SELECT 
  COUNT(*) as remaining_users_without_location
FROM users 
WHERE country IS NULL OR city IS NULL;
