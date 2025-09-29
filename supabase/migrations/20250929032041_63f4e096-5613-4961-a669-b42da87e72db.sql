-- Add RLS policies for cart table
CREATE POLICY "Users can view their own cart items" 
ON public.cart 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own cart items" 
ON public.cart 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own cart items" 
ON public.cart 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own cart items" 
ON public.cart 
FOR DELETE 
USING (user_id = auth.uid());