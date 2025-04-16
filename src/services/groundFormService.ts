
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GroundFormValues } from "@/components/admin/grounds/groundFormSchema";
import { Ground } from "@/types/models";

interface CreateGroundParams {
  values: GroundFormValues;
  isSuperAdmin: boolean;
  currentUserId?: string;
  images?: File[];
}

export const createGround = async ({ 
  values, 
  isSuperAdmin, 
  currentUserId,
  images = []
}: CreateGroundParams): Promise<Ground | null> => {
  try {
    // Format the games and facilities as arrays
    const gamesArray = values.games.split(',').map(game => game.trim());
    const facilitiesArray = values.facilities.split(',').map(facility => facility.trim());
    
    // Determine the owner ID (current user ID for regular admins, selected owner for super admins)
    const ownerId = isSuperAdmin ? values.ownerId : currentUserId;
    
    if (!ownerId) {
      throw new Error("Owner ID is required");
    }
    
    console.log("Inserting ground with owner_id:", ownerId);
    
    // Create a simplified location object that just stores the address
    const locationData = { address: values.address };
    
    // Handle image uploads if any
    const imageUrls: string[] = [];
    
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        const filePath = `grounds/${ownerId}/${fileName}`;
        
        // Upload the image to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('grounds')
          .upload(filePath, file);
        
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          continue; // Skip this image but continue with others
        }
        
        // Get the public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from('grounds')
          .getPublicUrl(filePath);
        
        if (urlData?.publicUrl) {
          imageUrls.push(urlData.publicUrl);
        }
      }
    }
    
    // Using direct insert method with simplified data
    const { data: groundData, error: insertError } = await supabase
      .from('grounds')
      .insert({
        name: values.name,
        description: values.description,
        address: values.address,
        owner_id: ownerId,
        games: gamesArray,
        facilities: facilitiesArray,
        location: locationData,
        images: imageUrls
      })
      .select();
    
    if (insertError) {
      console.error("Error creating ground:", insertError);
      throw new Error(insertError.message || "Failed to create ground");
    }
    
    console.log("Ground created successfully:", groundData);
    
    // Convert the response data to our Ground type
    if (groundData && groundData.length > 0) {
      const ground = groundData[0];
      
      return {
        id: ground.id,
        name: ground.name,
        description: ground.description || '',
        address: ground.address,
        location: { lat: 0, lng: 0 }, // Default location values
        ownerId: ground.owner_id,
        ownerName: 'Unknown Owner', // We don't have owner details in the response
        ownerContact: '',
        ownerWhatsapp: '',
        games: ground.games || [],
        facilities: ground.facilities || [],
        images: ground.images || [],
        rating: ground.rating || 0,
        reviewCount: ground.review_count || 0
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
    
    // Use the Postgres security definer function to get admin users
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
