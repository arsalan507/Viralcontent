# Quick Fix: Duplicate Content ID Error

## The Error

```
duplicate key value violates unique constraint "viral_analyses_content_id_key"
```

## What's Happening

The database trigger that auto-generates `content_id` is creating duplicate IDs when multiple scripts are submitted quickly. This causes the unique constraint to fail.

## Quick Fix Option 1: Remove Unique Constraint (Temporary)

**In Supabase SQL Editor:**

```sql
-- Temporarily make content_id non-unique (allows duplicates)
ALTER TABLE viral_analyses DROP CONSTRAINT IF EXISTS viral_analyses_content_id_key;

-- Add a non-unique index instead
CREATE INDEX IF NOT EXISTS idx_viral_analyses_content_id_nonunique ON viral_analyses(content_id);
```

This will allow scripts to be submitted immediately while we fix the trigger function.

## Quick Fix Option 2: Fix the Trigger (Recommended)

**In Supabase SQL Editor, run the SQL from `fix-content-id-generation.sql`:**

```sql
-- Copy and paste the entire content of fix-content-id-generation.sql
-- This will:
-- 1. Fix the trigger to prevent race conditions
-- 2. Clean up existing duplicates
-- 3. Ensure future submissions work correctly
```

## Quick Fix Option 3: Manual Cleanup (If Script Already Failed)

If a script submission already failed, you need to clean up the partial data:

```sql
-- Find the failed submission (usually the most recent one with NULL content_id)
SELECT id, content_id, hook, created_at
FROM viral_analyses
ORDER BY created_at DESC
LIMIT 5;

-- Delete the failed submission (replace YOUR_ID with the actual id)
DELETE FROM viral_analyses WHERE id = 'YOUR_ID';
```

Then try submitting again.

## Long-term Solution

The trigger function needs to be updated to use proper locking and retry logic. See `fix-content-id-generation.sql` for the complete solution.

## Testing After Fix

1. Go to the script submission page
2. Fill out a script
3. Click "Submit Analysis"
4. Should work without errors!

## If Error Persists

Check the Supabase logs to see the exact error:
1. Go to Supabase Dashboard
2. Click "Logs" → "Postgres Logs"
3. Look for the error message
4. Share with me for debugging

---

**The fastest fix right now is Option 1 - removes the unique constraint temporarily.**
