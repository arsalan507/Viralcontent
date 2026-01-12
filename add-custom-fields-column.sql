-- =============================================
-- Add custom_fields column to viral_analyses
-- Stores dynamic form builder fields as JSON
-- =============================================

-- Add custom_fields column to viral_analyses table
ALTER TABLE viral_analyses
  ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- Create index for better JSONB query performance
CREATE INDEX IF NOT EXISTS idx_viral_analyses_custom_fields
  ON viral_analyses USING gin (custom_fields);

-- Add comment
COMMENT ON COLUMN viral_analyses.custom_fields IS
  'Stores custom fields created via Form Builder as JSON key-value pairs';

-- Success message
SELECT '✅ custom_fields column added to viral_analyses table!' as status;
