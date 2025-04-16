
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GroundFormValues } from "@/components/admin/grounds/groundFormSchema";
import { Ground } from "@/types/models";

interface CreateGroundParams {
  values: GroundFormValues;
  isSuperAdmin: boolean;
  currentUserId?: string;
}

export const createGround = async ({ 
  values, 
  isSuperAdmin, 
  currentUserId 
}: CreateGroundParams): Promise<Ground | null> => {
  try {
    // Format the games and facilities as arrays
    const gamesArray = values.games.split(',').map(game => game.trim());
    const facilitiesArray = values.facilities.split(',').map(facility => facility.trim());
    
    // Create proper location object
    const location = {
      lat: 0,
      lng: 0
    };
    
    // Determine the owner ID (current user ID for regular admins, selected owner for super admins)
    const ownerId = isSuperAdmin ? values.ownerId : currentUserId;
    
    if (!ownerId) {
      throw new Error("Owner ID is required");
    }
    
    console.log("Inserting ground with owner_id:", ownerId);
    
    // Using direct insert method with proper data formatting
    const { data: directData, error: directError } = await supabase
      .from('grounds')
      .insert({
        name: values.name,
        description: values.description,
        address: values.address,
        owner_id: ownerId,
        games: gamesArray,
        facilities: facilitiesArray,
        location: location
      })
      .select();
    
    if (directError) {
      console.log("Direct insert failed, trying with custom query...", directError);
      
      // If direct insert fails, try manual query method
      // TypeScript doesn't know about our custom function, so we need to use a more generic approach
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'insert_ground' as any, // Type assertion to bypass TypeScript checking
        {
          name: values.name,
          description: values.description,
          address: values.address,
          owner_id: ownerId,
          games: gamesArray,
          facilities: facilitiesArray,
          location
        }
      );
        
      if (rpcError) {
        console.error("RPC error:", rpcError);
        throw new Error(rpcError.message || "Failed to create ground");
      }
      
      console.log("Ground created successfully with ID:", rpcData);
      return null; // We don't have the full ground object from the RPC function
    }
    
    console.log("Ground created successfully:", directData);
    
    // Convert the response data to our Ground type
    if (directData && directData.length > 0) {
      const groundData = directData[0];
      
      return {
        id: groundData.id,
        name: groundData.name,
        description: groundData.description || '',
        address: groundData.address,
        location: groundData.location || { lat: 0, lng: 0 },
        ownerId: groundData.owner_id,
        ownerName: 'Unknown Owner', // We don't have owner details in the response
        ownerContact: '',
        ownerWhatsapp: '',
        games: groundData.games || [],
        facilities: groundData.facilities || [],
        images: groundData.images || [],
        rating: groundData.rating || 0,
        reviewCount: groundData.review_count || 0
      };
    }
    
    return null;
  } catch (error: any) {
    console.error("Error creating ground:", error);
    throw error;
  }
};

// Function to fetch ground owners (admins)
export const fetchGroundOwners = async (): Promise<any[]> => {
  try {
    console.log("Fetching ground owners...");
    
    // Use the Postgres security definer function to bypass RLS
    const { data, error } = await supabase
      .rpc('get_admin_users');
      
    if (error) {
      console.error("Database error fetching ground owners:", error);
      throw error;
    }
    
    console.log("Ground owners data:", data);
    return data || [];
  } catch (error: any) {
    console.error("Error fetching ground owners:", error);
    
    // Fallback to mock data
    console.log("Falling back to mock data");
    const { users } = await import("@/data/mockData");
    const groundOwners = users.filter(user => user.role === 'admin');
    return groundOwners;
  }
};
