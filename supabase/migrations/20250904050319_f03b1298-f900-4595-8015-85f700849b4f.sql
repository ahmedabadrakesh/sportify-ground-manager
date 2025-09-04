-- Convert profession_type from single enum to array of enums in sports_professionals table
ALTER TABLE public.sports_professionals 
DROP COLUMN profession_type;

ALTER TABLE public.sports_professionals 
ADD COLUMN profession_type sport_profession_type[] DEFAULT ARRAY[]::sport_profession_type[];