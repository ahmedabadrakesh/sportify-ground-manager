import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Brand {
  [x: string]: any;
  brandId: string;
  brand_name: string;
  logo?: string;
  address?: string;
  city?: string;
  created_at: string;
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBrands() {
      setLoading(true);
      const { data, error } = await supabase.from("brands").select("*");
      if (error) {
        setBrands([]);
      } else {
        setBrands(data || []);
      }
      setLoading(false);
    }
    fetchBrands();
  }, []);

  return { brands, loading };
}