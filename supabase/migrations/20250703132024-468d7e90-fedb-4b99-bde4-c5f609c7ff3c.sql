
-- Add the missing fields to the sports_professionals table
ALTER TABLE public.sports_professionals 
ADD COLUMN years_of_experience integer,
ADD COLUMN total_match_played integer;
