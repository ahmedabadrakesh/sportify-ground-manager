
-- First, completely disable RLS and drop all policies on all tables
DO $$
DECLARE
    policy_record RECORD;
    table_record RECORD;
BEGIN
    -- Drop all policies on ALL tables in public schema
    FOR table_record IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        -- Drop all policies for each table
        FOR policy_record IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE tablename = table_record.tablename AND schemaname = table_record.schemaname
        LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON ' || table_record.schemaname || '.' || table_record.tablename;
        END LOOP;
        
        -- Disable RLS on the table
        EXECUTE 'ALTER TABLE ' || table_record.schemaname || '.' || table_record.tablename || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;

-- Drop any existing functions that might reference the role column
DROP FUNCTION IF EXISTS public.get_current_user_role() CASCADE;

-- Create enum for user roles
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('user', 'sports_professional', 'admin', 'super_admin', 'ground_owner');

-- Update users table role column to use the enum
ALTER TABLE public.users ALTER COLUMN role TYPE user_role USING 
    CASE 
        WHEN role = 'user' THEN 'user'::user_role
        WHEN role = 'admin' THEN 'admin'::user_role
        WHEN role = 'super_admin' THEN 'super_admin'::user_role
        WHEN role = 'ground_owner' THEN 'ground_owner'::user_role
        ELSE 'user'::user_role
    END;

-- Add user_id column to sports_professionals table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sports_professionals' AND column_name = 'user_id') THEN
        ALTER TABLE public.sports_professionals ADD COLUMN user_id uuid REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Re-enable RLS on key tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grounds ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM public.users 
        WHERE auth_id = auth.uid() OR id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (auth.uid()::text = auth_id::text OR auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (auth.uid()::text = auth_id::text OR auth.uid()::text = id::text);

CREATE POLICY "Super admins can view all users" 
ON public.users FOR SELECT 
USING (public.get_current_user_role() = 'super_admin');

CREATE POLICY "Super admins can update all users" 
ON public.users FOR UPDATE 
USING (public.get_current_user_role() = 'super_admin');

CREATE POLICY "Super admins can insert users" 
ON public.users FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'super_admin');

-- Create RLS policies for sports_professionals table
CREATE POLICY "Anyone can view sports professionals" 
ON public.sports_professionals FOR SELECT 
TO public;

CREATE POLICY "Users can create their own sports professional profile" 
ON public.sports_professionals FOR INSERT 
WITH CHECK (
    user_id IN (
        SELECT id FROM public.users 
        WHERE (auth_id = auth.uid() OR id = auth.uid())
    )
);

CREATE POLICY "Users can update their own sports professional profile" 
ON public.sports_professionals FOR UPDATE 
USING (
    user_id IN (
        SELECT id FROM public.users 
        WHERE (auth_id = auth.uid() OR id = auth.uid())
    )
);

CREATE POLICY "Super admins can manage all sports professionals" 
ON public.sports_professionals FOR ALL 
USING (public.get_current_user_role() = 'super_admin');

-- Recreate ground policies
CREATE POLICY "Anyone can view grounds" 
ON public.grounds FOR SELECT 
TO public;

CREATE POLICY "Ground owners can manage their grounds" 
ON public.grounds FOR ALL 
USING (
    owner_id IN (
        SELECT id FROM public.users 
        WHERE (auth_id = auth.uid() OR id = auth.uid()) 
        AND role = 'ground_owner'
    )
);

CREATE POLICY "Super admins can manage all grounds" 
ON public.grounds FOR ALL 
USING (public.get_current_user_role() = 'super_admin');

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.users (auth_id, name, email, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
        NEW.email,
        NEW.phone,
        COALESCE((NEW.raw_user_meta_data ->> 'user_type')::user_role, 'user'::user_role)
    )
    ON CONFLICT (auth_id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
