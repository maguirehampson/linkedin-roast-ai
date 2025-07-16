-- Database Migration: Add Missing Columns to Existing Roasts Table
-- Run this in your Supabase SQL editor to fix the schema

-- Add missing columns to existing roasts table
ALTER TABLE roasts 
ADD COLUMN IF NOT EXISTS vibe_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS share_quote TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS meme_caption TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS diagnostics JSONB DEFAULT '[]';

-- Update existing records to have non-null values for new required columns
UPDATE roasts 
SET 
    vibe_tags = COALESCE(vibe_tags, '{}'),
    share_quote = COALESCE(share_quote, ''),
    meme_caption = COALESCE(meme_caption, ''),
    diagnostics = COALESCE(diagnostics, '[]'::jsonb)
WHERE 
    vibe_tags IS NULL 
    OR share_quote IS NULL 
    OR meme_caption IS NULL 
    OR diagnostics IS NULL;

-- Now make the columns NOT NULL (after setting defaults)
ALTER TABLE roasts 
ALTER COLUMN vibe_tags SET NOT NULL,
ALTER COLUMN share_quote SET NOT NULL,
ALTER COLUMN meme_caption SET NOT NULL,
ALTER COLUMN diagnostics SET NOT NULL;

-- Verify the schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'roasts' 
ORDER BY ordinal_position;