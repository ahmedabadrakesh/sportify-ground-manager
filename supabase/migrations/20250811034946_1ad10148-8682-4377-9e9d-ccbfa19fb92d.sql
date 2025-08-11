-- Check current payment_method constraint
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'orders_payment_method_check';

-- Drop the existing constraint and recreate with all payment methods
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;

-- Add new constraint that includes all payment methods from the form
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check 
CHECK (payment_method IN ('cash', 'online', 'cod', 'upi', 'card', 'cheque', 'razorpay', 'stripe', 'paypal', 'direct_sale'));