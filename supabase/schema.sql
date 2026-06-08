CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  lecturer TEXT,
  due_date TIMESTAMP NOT NULL,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assignments_updated_at_trigger ON assignments;
CREATE TRIGGER assignments_updated_at_trigger
BEFORE UPDATE ON assignments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- This project intentionally allows public shared-board access without authentication.
DROP POLICY IF EXISTS "Allow public read" ON assignments;
CREATE POLICY "Allow public read" ON assignments
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON assignments;
CREATE POLICY "Allow public insert" ON assignments
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update" ON assignments;
CREATE POLICY "Allow public update" ON assignments
FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete" ON assignments;
CREATE POLICY "Allow public delete" ON assignments
FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE assignments;
