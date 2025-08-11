-- Fix the foreign key constraint to reference public.users instead of auth.users
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Add correct foreign key that references public.users table
ALTER TABLE public.orders ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id);