-- Add title column to notes table
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT 'Nueva nota';

-- Update existing notes to have a default title
UPDATE notes 
SET title = 'Nota sin título' 
WHERE title = 'Nueva nota' OR title IS NULL;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW; 
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on note updates
CREATE OR REPLACE TRIGGER update_notes_modtime
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
