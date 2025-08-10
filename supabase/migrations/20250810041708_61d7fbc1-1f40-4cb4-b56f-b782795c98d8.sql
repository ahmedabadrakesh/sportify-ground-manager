-- Enable RLS on products table and add admin policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage products (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.auth_id = auth.uid() 
    AND users.role IN ('admin', 'super_admin')
  )
);

-- Enable RLS on inventory_items table (mentioned in the issue)
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Update existing inventory_items policy to use auth_id instead of id
DROP POLICY IF EXISTS "Admins can manage inventory_items" ON public.inventory_items;

CREATE POLICY "Admins can manage inventory_items" 
ON public.inventory_items 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.auth_id = auth.uid() 
    AND users.role IN ('admin', 'super_admin')
  )
);