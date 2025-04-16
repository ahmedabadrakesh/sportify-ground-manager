
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GroundFormValues } from "@/components/admin/grounds/groundFormSchema";

export const fetchGroundOwners = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, phone')
      .eq('role', 'admin');
    
    if (error) {
      console.error("Error fetching ground owners:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchGroundOwners:", error);
    return [];
  }
};

export const createGround = async ({ 
  values, 
  isSuperAdmin, 
  currentUserId,
  images = []
}: { 
  values: GroundFormValues, 
  isSuperAdmin: boolean, 
  currentUserId?: string,
  images?: File[]
}) => {
  try {
    // Parse games and facilities from comma-separated strings to arrays
    const gamesArray = values.games ? values.games.split(',').map(item => item.trim()) : [];
    const facilitiesArray = values.facilities ? values.facilities.split(',').map(item => item.trim()) : [];

    // Determine owner ID (if not super admin, use current user's ID)
    const ownerId = isSuperAdmin ? values.ownerId : currentUserId;

    if (!ownerId) {
      throw new Error("Owner ID is required");
    }

    // Upload images to storage if provided
    const imageUrls: string[] = [];
    
    if (images && images.length > 0) {
      for (const image of images) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('grounds')
          .upload(fileName, image);
        
        if (error) {
          console.error("Error uploading image:", error);
          throw error;
        }
        
        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('grounds')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }
    }

    // Create ground record
    const { data, error } = await supabase
      .from('grounds')
      .insert({
        name: values.name,
        description: values.description,
        address: values.address,
        owner_id: ownerId,
        games: gamesArray,
        facilities: facilitiesArray,
        images: imageUrls
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating ground:", error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Error in createGround:", error);
    throw error;
  }
};
