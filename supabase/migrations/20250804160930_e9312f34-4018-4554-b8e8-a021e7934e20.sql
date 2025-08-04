-- Add new fields to sports_professionals table for enhanced professional profiles

-- Add basic info fields
ALTER TABLE public.sports_professionals 
ADD COLUMN academy_name TEXT,
ADD COLUMN whatsapp TEXT,
ADD COLUMN whatsapp_same_as_phone BOOLEAN DEFAULT false;

-- Add tournament participation fields
ALTER TABLE public.sports_professionals 
ADD COLUMN district_level_tournaments INTEGER DEFAULT 0,
ADD COLUMN state_level_tournaments INTEGER DEFAULT 0,
ADD COLUMN national_level_tournaments INTEGER DEFAULT 0,
ADD COLUMN international_level_tournaments INTEGER DEFAULT 0;

-- Add professional details
ALTER TABLE public.sports_professionals 
ADD COLUMN specialties TEXT[] DEFAULT '{}',
ADD COLUMN education TEXT[] DEFAULT '{}';

-- Add pricing fields
ALTER TABLE public.sports_professionals 
ADD COLUMN one_on_one_price NUMERIC DEFAULT 0,
ADD COLUMN group_session_price NUMERIC DEFAULT 0,
ADD COLUMN online_price NUMERIC DEFAULT 0,
ADD COLUMN free_demo_call BOOLEAN DEFAULT false;

-- Add about me and success stories
ALTER TABLE public.sports_professionals 
ADD COLUMN about_me TEXT,
ADD COLUMN success_stories JSONB DEFAULT '[]';

-- Add enhanced training locations with more details (replacing simple text array)
ALTER TABLE public.sports_professionals 
ADD COLUMN training_locations_detailed JSONB DEFAULT '[]';

-- Update the updated_at trigger to include new fields
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists for sports_professionals
DROP TRIGGER IF EXISTS update_sports_professionals_updated_at ON public.sports_professionals;
CREATE TRIGGER update_sports_professionals_updated_at
    BEFORE UPDATE ON public.sports_professionals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();