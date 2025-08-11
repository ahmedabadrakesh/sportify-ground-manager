-- Add direct_sell column to orders table
ALTER TABLE public.orders 
ADD COLUMN direct_sell boolean DEFAULT false;

-- Create direct_sales table for tracking direct sales
CREATE TABLE public.direct_sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    item_id uuid REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    ground_id uuid REFERENCES public.grounds(id) ON DELETE CASCADE,
    quantity integer NOT NULL,
    unit_price numeric NOT NULL,
    total_price numeric NOT NULL,
    sold_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on direct_sales table
ALTER TABLE public.direct_sales ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage direct sales
CREATE POLICY "Admins can manage direct_sales" 
ON public.direct_sales 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.auth_id = auth.uid() 
    AND users.role IN ('admin', 'super_admin')
));

-- Create trigger for updating updated_at
CREATE TRIGGER update_direct_sales_updated_at
    BEFORE UPDATE ON public.direct_sales
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();