-- Add remarks column to assignments table
ALTER TABLE assignments 
  ADD COLUMN IF NOT EXISTS remarks TEXT;