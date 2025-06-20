
-- First, let's check if the user_role enum already exists and drop it if needed
DROP TYPE IF EXISTS public.user_role CASCADE;

-- Create the user_role enum with all the values we need
CREATE TYPE public.user_role AS ENUM ('user', 'sports_professional', 'admin', 'super_admin', 'ground_owner');

-- Add the role column (this will fail if it already exists, so we use DO block)
DO $$ 
BEGIN
    -- Try to add the role column
    BEGIN
        ALTER TABLE public.users ADD COLUMN role user_role DEFAULT 'user'::user_role NOT NULL;
    EXCEPTION 
        WHEN duplicate_column THEN
            -- Column already exists, so just update its type
            ALTER TABLE public.users 
            ALTER COLUMN role TYPE user_role USING 
              CASE 
                WHEN role::text = 'user' THEN 'user'::user_role
                WHEN role::text = 'sports_professional' THEN 'sports_professional'::user_role  
                WHEN role::text = 'admin' THEN 'admin'::user_role
                WHEN role::text = 'super_admin' THEN 'super_admin'::user_role
                WHEN role::text = 'ground_owner' THEN 'ground_owner'::user_role
                ELSE 'user'::user_role
              END;
            
            -- Set default value and NOT NULL constraint
            ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'user'::user_role;
            ALTER TABLE public.users ALTER COLUMN role SET NOT NULL;
    END;
END $$;

-- Recreate the trigger function with proper error handling
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
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error and still return NEW to not block auth
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
