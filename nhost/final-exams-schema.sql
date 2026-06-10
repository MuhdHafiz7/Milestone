-- Create separate final_exams table
CREATE TABLE IF NOT EXISTS final_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  exam_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_final_exams_subject_id ON final_exams(subject_id);
CREATE INDEX IF NOT EXISTS idx_final_exams_exam_date ON final_exams(exam_date);

-- Permissions for public role (run in Hasura Console)
-- Data -> final_exams -> Permissions -> public role
-- Allow: select, insert, update, delete