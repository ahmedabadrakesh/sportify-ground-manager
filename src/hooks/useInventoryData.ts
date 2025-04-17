
import { useState, useEffect } from "react";
import { InventoryItem, GroundInventory, Ground } from "@/types/models";
import { getAllInventoryItems } from "@/utils/inventory";
import { getGroundInventory } from "@/utils/inventory/inventory-ground";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useInventoryData = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [groundInventory, setGroundInventory] = useState<GroundInventory[]>([]);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGround, setSelectedGround] = useState<string>("");

  const fetchGrounds = async () => {
    try {
      const { data, error } = await supabase
        .from('grounds')
        .select('*');
      
      if (error) {
        console.error("Error fetching grounds:", error);
        toast.error("Failed to load grounds data");
        return [];
      }
      
      return data.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description || "",
        address: g.address,
        location: g.location as { lat: number; lng: number },
        ownerId: g.owner_id,
        ownerName: "", // Would be fetched in a real app
        ownerContact: "",
        ownerWhatsapp: "",
        games: g.games || [],
        facilities: g.facilities || [],
        images: g.images || [],
        rating: g.rating,
        reviewCount: g.review_count
      }));
    } catch (error) {
      console.error("Error fetching grounds:", error);
      toast.error("Failed to load grounds data");
      return [];
    }
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch inventory items
      const items = await getAllInventoryItems();
      setInventoryItems(items);
      
      // Fetch grounds
      const fetchedGrounds = await fetchGrounds();
      setGrounds(fetchedGrounds);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchGroundInventory = async () => {
      if (selectedGround) {
        try {
          const inventory = await getGroundInventory(selectedGround);
          setGroundInventory(inventory);
        } catch (error) {
          console.error("Error fetching ground inventory:", error);
          toast.error("Failed to load ground inventory");
        }
      } else {
        setGroundInventory([]);
      }
    };
    
    fetchGroundInventory();
  }, [selectedGround]);

  return {
    inventoryItems,
    groundInventory,
    grounds,
    loading,
    selectedGround,
    setSelectedGround,
    refreshData: fetchData
  };
};
