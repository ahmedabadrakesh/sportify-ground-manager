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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      setLoading(true);
      try {
        // For now, return empty array since brands table needs to be set up properly
        setBrands([]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  return { brands, loading };
}