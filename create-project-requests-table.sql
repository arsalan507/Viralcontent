-- Create project_requests table for videographers to submit new project ideas

CREATE TABLE IF NOT EXISTS project_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Request details
  title TEXT NOT NULL,
  description TEXT,
  estimated_shoot_date DATE,
  people_required INTEGER,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS')),

  -- User info
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,

  -- Notes
  admin_notes TEXT,

  -- If approved, link to the created viral_analysis
  viral_analysis_id UUID REFERENCES viral_analyses(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_requests_requested_by ON project_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_project_requests_status ON project_requests(status);
CREATE INDEX IF NOT EXISTS idx_project_requests_created_at ON project_requests(created_at DESC);

-- Add RLS policies
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;

-- Videographers can create their own requests
CREATE POLICY "Videographers can create project requests"
  ON project_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = requested_by
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'VIDEOGRAPHER'
    )
  );

-- Videographers can view their own requests
CREATE POLICY "Videographers can view own requests"
  ON project_requests
  FOR SELECT
  TO authenticated
  USING (
    requested_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'SUPER_ADMIN'
    )
  );

-- Admins can view all requests
CREATE POLICY "Admins can view all project requests"
  ON project_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'SUPER_ADMIN'
    )
  );

-- Admins can update requests
CREATE POLICY "Admins can update project requests"
  ON project_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'SUPER_ADMIN'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_project_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_project_requests_updated_at_trigger ON project_requests;
CREATE TRIGGER update_project_requests_updated_at_trigger
  BEFORE UPDATE ON project_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_project_requests_updated_at();

-- Success message
SELECT 'Project requests table created successfully!' as status;
