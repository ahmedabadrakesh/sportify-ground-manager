import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Brand {
  id: number;
  brand_name: string;
  logo?: string;
  address?: string;
  city?: string;
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  // Temporarily returning empty brands array
  // TODO: Enable when brands table is properly typed in Supabase schema
  return { brands: [], loading: false };
}