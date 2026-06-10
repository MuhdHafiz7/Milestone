-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default subjects
INSERT INTO subjects (name, color) VALUES 
  ('Math', '#ef4444'),
  ('Science', '#22c55e'),
  ('English', '#3b82f6'),
  ('History', '#f59e0b'),
  ('Computer Science', '#8b5cf6')
ON CONFLICT (name) DO NOTHING;

-- Add subject_id to assignments
ALTER TABLE assignments 
  ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES subjects(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_assignments_subject_id ON assignments(subject_id);

-- Set up permissions for public role (no auth)
-- In Hasura Console: Data -> subjects -> Permissions -> role: public
-- Allow: select, insert (so users can add custom subjects)