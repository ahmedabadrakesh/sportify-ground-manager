-- Add updated_by field to sports_professionals table
ALTER TABLE public.sports_professionals 
ADD COLUMN IF NOT EXISTS updated_by TEXT;