-- Add missing is_draft column to sports_professionals table
ALTER TABLE public.sports_professionals 
ADD COLUMN is_draft boolean DEFAULT false;

-- Add index for better performance on draft queries
CREATE INDEX idx_sports_professionals_is_draft ON public.sports_professionals(user_id, is_draft);