-- Add multilingual translation fields to game_templates table
ALTER TABLE game_templates
ADD COLUMN IF NOT EXISTS title_translations JSONB,
ADD COLUMN IF NOT EXISTS description_translations JSONB,
ADD COLUMN IF NOT EXISTS instructions_translations JSONB,
ADD COLUMN IF NOT EXISTS example_evidence_translations JSONB;

-- Add comments
COMMENT ON COLUMN game_templates.title_translations IS 'Multilingual translations for title: { en: "...", es: "...", ja: "..." }';
COMMENT ON COLUMN game_templates.description_translations IS 'Multilingual translations for description';
COMMENT ON COLUMN game_templates.instructions_translations IS 'Multilingual translations for instructions';
COMMENT ON COLUMN game_templates.example_evidence_translations IS 'Multilingual translations for example evidence';

