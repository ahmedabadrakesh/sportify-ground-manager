-- Fix security issues: Enable RLS on all public tables that need it

-- Enable RLS on tables that don't have it
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ground_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ground_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_slots ENABLE ROW LEVEL SECURITY;

-- Create basic policies for public viewing where appropriate
CREATE POLICY "Anyone can view games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Anyone can view facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);

-- Create restrictive policies for sensitive data
CREATE POLICY "Users can view their own bookings" ON public.bookings 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bookings" ON public.bookings 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own orders" ON public.orders 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own orders" ON public.orders 
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin-only policies for management tables
CREATE POLICY "Admins can manage inventory_items" ON public.inventory_items 
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admins can manage ground_inventory" ON public.ground_inventory 
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Admins can manage ground_facilities" ON public.ground_facilities 
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Anyone can view time_slots" ON public.time_slots FOR SELECT USING (true);
CREATE POLICY "Admins can manage time_slots" ON public.time_slots 
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Anyone can view sports_areas" ON public.sports_areas FOR SELECT USING (true);
CREATE POLICY "Admins can manage sports_areas" ON public.sports_areas 
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Users can view order_items for their orders" ON public.order_items 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can view booking_slots for their bookings" ON public.booking_slots 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_slots.booking_id AND bookings.user_id = auth.uid()
  ));