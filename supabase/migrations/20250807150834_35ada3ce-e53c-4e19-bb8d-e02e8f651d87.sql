-- Add games_played column to store array of game names
ALTER TABLE public.sports_professionals 
ADD COLUMN games_played TEXT[];