-- Check current constraint and fix order_status values
-- First, let's see what the current constraint allows
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'orders_order_status_check';

-- Drop the existing constraint and recreate with proper values
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_order_status_check;

-- Add new constraint that includes all necessary statuses
ALTER TABLE public.orders ADD CONSTRAINT orders_order_status_check 
CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'));

-- Also fix payment_status constraint if needed
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check 
CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'completed'));