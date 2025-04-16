
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Ground } from "@/types/models";

interface FetchGroundsOptions {
  isSuperAdmin: boolean;
  currentUserId?: string;
}

export const fetchGrounds = async ({ isSuperAdmin, currentUserId }: FetchGroundsOptions) => {
  try {
    console.log("Fetching grounds data with auth...");
    
    // With our RLS policies in place, we can simplify our query
    // The policies will automatically filter results based on user role
    let query = supabase.from('grounds').select(`
      id, 
      name, 
      description, 
      address, 
      location, 
      owner_id, 
      games, 
      facilities, 
      images, 
      rating, 
      review_count
    `);
    
    // The RLS policies will handle permissions correctly now
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching grounds:", error);
      throw error;
    }
    
    console.log("Ground data fetched:", data);
    
    // Make sure data is an array before we try to map it
    if (Array.isArray(data)) {
      return formatGroundsData(data);
    }
    
    throw new Error("Invalid data format received");
  } catch (error) {
    console.error("Error in fetchGrounds:", error);
    throw error;
  }
};

export const deleteGround = async (groundId: string) => {
  try {
    // The RLS policies will ensure only authorized users can delete
    const { error } = await supabase
      .from('grounds')
      .delete()
      .eq('id', groundId);
    
    if (error) {
      console.error("Error deleting ground:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteGround:", error);
    throw error;
  }
};

// Helper function to transform API data to Ground model
const formatGroundsData = (data: any[]): Ground[] => {
  return data.map(ground => {
    return {
      id: ground.id,
      name: ground.name,
      description: ground.description || '',
      address: ground.address,
      // Simplify location to just use default values
      location: { lat: 0, lng: 0 },
      ownerId: ground.owner_id,
      ownerName: 'Unknown Owner', // We'll fetch this separately if needed
      ownerContact: '',
      ownerWhatsapp: '',
      games: ground.games || [],
      facilities: ground.facilities || [],
      images: ground.images || [],
      rating: ground.rating || 0,
      reviewCount: ground.review_count || 0
    };
  });
};

// Fallback to get mock data if needed
export const getMockGroundsData = async (isSuperAdmin: boolean, currentUserId?: string) => {
  const { grounds } = await import("@/data/mockData");
  console.log("Using mock ground data");
  
  if (isSuperAdmin) {
    return grounds;
  }
  
  return grounds.filter(ground => ground.ownerId === currentUserId);
};
