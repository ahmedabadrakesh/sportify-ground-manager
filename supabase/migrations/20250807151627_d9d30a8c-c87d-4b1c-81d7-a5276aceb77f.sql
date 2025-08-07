-- Change game_id to be an array of UUIDs to support multiple games
ALTER TABLE public.sports_professionals 
DROP COLUMN game_id;

ALTER TABLE public.sports_professionals 
ADD COLUMN game_ids UUID[];

-- Remove the games_played column since we'll use game_ids with proper mapping
ALTER TABLE public.sports_professionals 
DROP COLUMN games_played;