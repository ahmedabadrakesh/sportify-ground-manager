-- Insert missing admin users to resolve foreign key constraint error
INSERT INTO public.users (id, name, email, phone, role, created_at, updated_at) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Super Admin', 'sa@123456', '', 'super_admin', now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'Admin User', 'a@123456', '', 'admin', now(), now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = now();

-- Also add the real admin users
INSERT INTO public.users (id, name, email, phone, role, created_at, updated_at) 
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'Super Admin', 'ronak@jokova.com', '', 'super_admin', now(), now()),
  ('00000000-0000-0000-0000-000000000004', 'Super Admin', 'damini@jokova.com', '', 'super_admin', now(), now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = now();