-- IMMEDIATE FIX: Remove unique constraint on content_id
-- This allows scripts to be submitted immediately while we fix the trigger later

-- Drop the unique constraint
ALTER TABLE viral_analyses DROP CONSTRAINT IF EXISTS viral_analyses_content_id_key;

-- Success message
SELECT 'Fixed! Varun can now submit scripts. The content_id field will still be auto-generated, but duplicates are now allowed temporarily.' as status;
