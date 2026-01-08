-- 更新商品分类从中文到英文
-- Update shop item categories from Chinese to English

-- 虚拟物品 -> VIRTUAL
UPDATE shop_items
SET category = 'VIRTUAL'
WHERE category = '虚拟物品';

-- 实物商品 -> PHYSICAL
UPDATE shop_items
SET category = 'PHYSICAL'
WHERE category = '实物商品';

-- VIP -> VIP (保持不变,但确保大写)
UPDATE shop_items
SET category = 'VIP'
WHERE category = 'VIP' OR category = 'vip';

-- 特权功能 -> PRIVILEGE
UPDATE shop_items
SET category = 'PRIVILEGE'
WHERE category = '特权功能';

