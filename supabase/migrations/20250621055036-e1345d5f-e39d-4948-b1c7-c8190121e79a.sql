
-- Create a direct users registration table that doesn't depend on Supabase Auth
CREATE TABLE public.phone_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  user_type TEXT NOT NULL DEFAULT 'user' CHECK (user_type IN ('user', 'sports_professional')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index on phone for faster lookups
CREATE INDEX idx_phone_registrations_phone ON public.phone_registrations(phone);

-- Add updated_at trigger
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.phone_registrations 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Enable RLS (though we'll allow all operations for now since there's no auth)
ALTER TABLE public.phone_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (since we're not using Supabase auth)
CREATE POLICY "Allow all operations on phone_registrations" 
  ON public.phone_registrations 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
