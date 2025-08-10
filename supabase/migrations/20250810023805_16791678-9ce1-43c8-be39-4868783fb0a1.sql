-- Soft delete support for sports professionals
ALTER TABLE public.sports_professionals
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL;

-- Helpful index for filtering active records
CREATE INDEX IF NOT EXISTS idx_sports_professionals_deleted_at
ON public.sports_professionals (deleted_at);
