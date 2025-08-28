-- Add age and sex columns to sports_professionals table
ALTER TABLE sports_professionals 
ADD COLUMN age integer,
ADD COLUMN sex text;