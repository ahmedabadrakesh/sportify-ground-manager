
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
  values: any,
  isSuperAdmin: boolean, 
  currentUserId?: string,
  images?: File[]
}) => {
  try {
    // Parse games from array of ids instead of comma-separated string
    const gamesArray = Array.isArray(values.games) ? values.games : [];
    const facilitiesArray = Array.isArray(values.facilities) ? values.facilities : [];

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

    // Create ground record with facilities
    const { data, error } = await supabase
      .from('grounds')
      .insert({
        name: values.name,
        description: values.description,
        address: values.address,
        owner_id: ownerId,
        games: values.games,
        facilities: values.facilities,
        images: imageUrls
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating ground:", error);
      throw error;
    }

    // Create ground-facility relationships
    if (values.facilities && values.facilities.length > 0) {
      const facilityRelations = values.facilities.map((facilityId: string) => ({
        ground_id: data.id,
        facility_id: facilityId
      }));

      const { error: relationError } = await supabase
        .from('ground_facilities')
        .insert(facilityRelations);

      if (relationError) {
        console.error("Error creating facility relations:", relationError);
        throw relationError;
      }
    }

    return data;
  } catch (error: any) {
    console.error("Error in createGround:", error);
    throw error;
  }
};
