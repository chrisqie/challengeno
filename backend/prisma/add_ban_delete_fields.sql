-- 手动添加封禁和删除字段
-- 如果字段已存在，会报错但不影响其他字段的添加

-- 添加封禁相关字段
DO $$ 
BEGIN
    -- 添加 is_banned 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_banned'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "is_banned" BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- 添加 banned_until 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'banned_until'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "banned_until" TIMESTAMP(3);
    END IF;

    -- 添加 ban_reason 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'ban_reason'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "ban_reason" TEXT;
    END IF;

    -- 添加 is_deleted 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_deleted'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- 添加 deleted_at 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "deleted_at" TIMESTAMP(3);
    END IF;

    -- 添加 delete_reason 字段
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'delete_reason'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "delete_reason" TEXT;
    END IF;
END $$;

