
-- Fix the foreign key constraint for sports_professionals table
-- First, drop the existing incorrect foreign key constraint
ALTER TABLE public.sports_professionals 
DROP CONSTRAINT IF EXISTS sports_professionals_user_id_fkey;

-- Add the correct foreign key constraint that references users.id
ALTER TABLE public.sports_professionals 
ADD CONSTRAINT sports_professionals_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
