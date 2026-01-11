-- Simple Fix for Content ID Duplicate Error
-- This removes the problematic FOR UPDATE and uses a simpler approach

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS auto_generate_content_id ON viral_analyses;
DROP FUNCTION IF EXISTS generate_content_id();

-- Create simplified function without FOR UPDATE
CREATE OR REPLACE FUNCTION generate_content_id()
RETURNS TRIGGER AS $$
DECLARE
  industry_code TEXT;
  next_number INTEGER;
  new_content_id TEXT;
BEGIN
  -- Get industry short code
  SELECT short_code INTO industry_code
  FROM industries
  WHERE id = NEW.industry_id;

  -- If no industry, use default 'GEN'
  IF industry_code IS NULL THEN
    industry_code := 'GEN';
  END IF;

  -- Get next number for this industry using a more robust approach
  -- Use current timestamp to add uniqueness
  SELECT COALESCE(MAX(
    CASE
      WHEN content_id ~ ('^' || industry_code || '-[0-9]+$')
      THEN CAST(SUBSTRING(content_id FROM '[0-9]+$') AS INTEGER)
      ELSE 1000
    END
  ), 1000) + 1
  INTO next_number
  FROM viral_analyses
  WHERE content_id LIKE industry_code || '-%';

  -- Generate new content ID
  new_content_id := industry_code || '-' || next_number;

  -- If this ID somehow exists (race condition), add timestamp suffix
  IF EXISTS (SELECT 1 FROM viral_analyses WHERE content_id = new_content_id) THEN
    new_content_id := industry_code || '-' || next_number || '-' || EXTRACT(EPOCH FROM NOW())::BIGINT;
  END IF;

  NEW.content_id := new_content_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER auto_generate_content_id
  BEFORE INSERT ON viral_analyses
  FOR EACH ROW
  WHEN (NEW.content_id IS NULL)
  EXECUTE FUNCTION generate_content_id();

-- Clean up any NULL content_ids from failed inserts
UPDATE viral_analyses
SET content_id = 'GEN-' || EXTRACT(EPOCH FROM created_at)::BIGINT
WHERE content_id IS NULL;

-- Show success message
SELECT 'Content ID generation fixed! Trigger recreated successfully.' as status;
