-- Add type column to assignments for final exams
ALTER TABLE assignments 
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'assignment' CHECK (type IN ('assignment', 'final_exam'));

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_assignments_type ON assignments(type);