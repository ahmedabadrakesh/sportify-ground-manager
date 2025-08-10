-- Drop products table and related policies since we're now using inventory_items
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP TABLE IF EXISTS public.products CASCADE;

-- Drop orders and order_items tables since they referenced products
DROP POLICY IF EXISTS "Users can view order_items for their orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- Update inventory_items to be more suitable for e-commerce
ALTER TABLE public.inventory_items 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;