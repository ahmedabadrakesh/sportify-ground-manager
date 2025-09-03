
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Game {
  popular_game: any;
  id: string;
  name: string;
  game_images?: any;
}

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      const { data, error } = await supabase.from("games").select("*").order("name", { ascending: true });
      if (error) {
        setGames([]);
      } else {
        setGames(data || []);
      }
      setLoading(false);
    }
    fetchGames();
  }, []);

  return { games, loading };
}
