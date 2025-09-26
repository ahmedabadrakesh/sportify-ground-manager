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
        const { data, error } = await supabase
          .from("brands" as any)
          .select("*")
          .order("brand_name", { ascending: true });
        
        if (error) {
          console.error("Error fetching brands:", error);
          setBrands([]);
        } else {
          setBrands(data || []);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      }
      setLoading(false);
    }
    fetchBrands();
  }, []);

  return { brands, loading };
}