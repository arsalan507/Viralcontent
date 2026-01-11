-- Fix Content ID Generation to Prevent Duplicates
-- This script fixes the race condition in content_id generation

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS auto_generate_content_id ON viral_analyses;
DROP FUNCTION IF EXISTS generate_content_id();

-- Create improved function with better uniqueness guarantee
CREATE OR REPLACE FUNCTION generate_content_id()
RETURNS TRIGGER AS $$
DECLARE
  industry_code TEXT;
  next_number INTEGER;
  new_content_id TEXT;
  max_attempts INTEGER := 10;
  attempt INTEGER := 0;
BEGIN
  -- Get industry short code
  SELECT short_code INTO industry_code
  FROM industries
  WHERE id = NEW.industry_id;

  -- If no industry, use default 'GEN'
  IF industry_code IS NULL THEN
    industry_code := 'GEN';
  END IF;

  -- Try to generate unique content_id with retry logic
  LOOP
    attempt := attempt + 1;

    -- Get next number for this industry with proper locking
    SELECT COALESCE(MAX(
      CASE
        WHEN content_id ~ (industry_code || '-[0-9]+$')
        THEN CAST(SUBSTRING(content_id FROM '[0-9]+$') AS INTEGER)
        ELSE 0
      END
    ), 1000) + 1
    INTO next_number
    FROM viral_analyses
    WHERE content_id LIKE industry_code || '-%'
    FOR UPDATE;  -- Lock the rows to prevent race condition

    -- Generate new content ID
    new_content_id := industry_code || '-' || next_number;

    -- Check if this ID already exists
    IF NOT EXISTS (SELECT 1 FROM viral_analyses WHERE content_id = new_content_id) THEN
      NEW.content_id := new_content_id;
      RETURN NEW;
    END IF;

    -- If we've tried too many times, use a UUID-based fallback
    IF attempt >= max_attempts THEN
      new_content_id := industry_code || '-' || FLOOR(RANDOM() * 900000 + 100000)::TEXT;
      NEW.content_id := new_content_id;
      RETURN NEW;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER auto_generate_content_id
  BEFORE INSERT ON viral_analyses
  FOR EACH ROW
  WHEN (NEW.content_id IS NULL)
  EXECUTE FUNCTION generate_content_id();

-- Clean up any existing duplicate content_ids by regenerating them
DO $$
DECLARE
  duplicate_record RECORD;
  new_id TEXT;
  counter INTEGER;
BEGIN
  FOR duplicate_record IN
    SELECT id, content_id, industry_id
    FROM viral_analyses
    WHERE content_id IN (
      SELECT content_id
      FROM viral_analyses
      WHERE content_id IS NOT NULL
      GROUP BY content_id
      HAVING COUNT(*) > 1
    )
    ORDER BY created_at ASC
  LOOP
    -- Skip the first occurrence, only update duplicates
    SELECT COUNT(*) INTO counter
    FROM viral_analyses
    WHERE content_id = duplicate_record.content_id
    AND created_at < (SELECT created_at FROM viral_analyses WHERE id = duplicate_record.id);

    IF counter > 0 THEN
      -- Generate new unique ID for duplicate
      SELECT COALESCE(
        (SELECT short_code FROM industries WHERE id = duplicate_record.industry_id),
        'GEN'
      ) INTO new_id;

      new_id := new_id || '-' || FLOOR(RANDOM() * 900000 + 100000)::TEXT;

      -- Update the duplicate record
      UPDATE viral_analyses
      SET content_id = new_id
      WHERE id = duplicate_record.id;

      RAISE NOTICE 'Updated duplicate content_id: % -> %', duplicate_record.content_id, new_id;
    END IF;
  END LOOP;
END $$;

-- Verify no duplicates remain
SELECT 'Duplicate Check:' as check_type, content_id, COUNT(*) as count
FROM viral_analyses
WHERE content_id IS NOT NULL
GROUP BY content_id
HAVING COUNT(*) > 1;
