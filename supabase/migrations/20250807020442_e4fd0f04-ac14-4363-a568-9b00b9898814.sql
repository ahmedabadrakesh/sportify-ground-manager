-- Add isCertified field to sports_professionals table
ALTER TABLE public.sports_professionals 
ADD COLUMN is_certified boolean DEFAULT false;