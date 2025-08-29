-- Add number_of_clients_served field to sports_professionals table
ALTER TABLE public.sports_professionals 
ADD COLUMN number_of_clients_served integer DEFAULT 0;