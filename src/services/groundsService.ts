
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Ground } from "@/types/models";

interface FetchGroundsOptions {
  isSuperAdmin: boolean;
  currentUserId?: string;
}

export const fetchGrounds = async ({ isSuperAdmin, currentUserId }: FetchGroundsOptions) => {
  try {
    console.log("Fetching grounds data...");
    
    // TypeScript doesn't know about our custom function, so we need to use a type assertion
    const { data, error } = await supabase
      .rpc('get_all_grounds_with_owners' as any, { 
        is_super_admin: isSuperAdmin,
        current_user_id: currentUserId
      });
    
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
    // Ensure location has lat and lng properties
    let locationObj = { lat: 0, lng: 0 };
    
    // If location exists and is an object with lat/lng, use it
    if (ground.location && typeof ground.location === 'object') {
      try {
        const loc = ground.location as Record<string, any>;
        if ('lat' in loc && 'lng' in loc) {
          locationObj = {
            lat: Number(loc.lat),
            lng: Number(loc.lng)
          };
        }
      } catch (e) {
        console.error("Error parsing location:", e);
      }
    }
    
    return {
      id: ground.id,
      name: ground.name,
      description: ground.description || '',
      address: ground.address,
      location: locationObj,
      ownerId: ground.owner_id,
      ownerName: ground.owner_name || 'Unknown Owner',
      ownerContact: ground.owner_phone || '',
      ownerWhatsapp: ground.owner_whatsapp || '',
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
