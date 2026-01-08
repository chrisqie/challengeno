-- 将 evidence_content 字段明确设置为 TEXT 类型（如果还不是的话）
-- PostgreSQL 的 TEXT 类型没有长度限制，可以存储大型 base64 编码的文件

-- 检查当前字段类型
DO $$
BEGIN
    -- 如果字段是 VARCHAR，则转换为 TEXT
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bet_participants'
        AND column_name = 'evidence_content'
        AND data_type = 'character varying'
    ) THEN
        ALTER TABLE bet_participants ALTER COLUMN evidence_content TYPE TEXT;
        RAISE NOTICE 'evidence_content column converted from VARCHAR to TEXT';
    ELSE
        RAISE NOTICE 'evidence_content column is already TEXT type';
    END IF;
END $$;

