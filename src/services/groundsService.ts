
import { supabase } from "@/integrations/supabase/client";
import { Ground } from "@/types/models";
import { toast } from "sonner";

interface FetchGroundsOptions {
  isSuperAdmin: boolean;
  currentUserId?: string;
}

export const fetchGrounds = async ({ isSuperAdmin, currentUserId }: FetchGroundsOptions = { isSuperAdmin: false }) => {
  try {
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
      review_count,
      users(name, phone, whatsapp)
    `);

    // If not super admin and currentUserId exists, filter by owner_id
    if (!isSuperAdmin && currentUserId) {
      query = query.eq('owner_id', currentUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching grounds:", error);
      throw error;
    }

    return formatGroundsData(data || []);
  } catch (error) {
    console.error("Error in fetchGrounds:", error);
    toast.error("Failed to load grounds");
    throw error;
  }
};

// Get a ground by ID
export const fetchGroundById = async (groundId: string) => {
  try {
    const { data, error } = await supabase
      .from('grounds')
      .select(`
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
        review_count,
        users(name, phone, whatsapp)
      `)
      .eq('id', groundId)
      .single();

    if (error) {
      console.error("Error fetching ground:", error);
      throw error;
    }

    return formatGroundData(data);
  } catch (error) {
    console.error("Error in fetchGroundById:", error);
    toast.error("Failed to load ground details");
    throw error;
  }
};

// Helper function to transform API data to Ground model
const formatGroundsData = (data: any[]): Ground[] => {
  return data.map(ground => formatGroundData(ground));
};

// Helper function to transform a single ground from API data
const formatGroundData = (ground: any): Ground => {
  return {
    id: ground.id,
    name: ground.name,
    description: ground.description || '',
    address: ground.address,
    location: ground.location || { lat: 0, lng: 0 },
    ownerId: ground.owner_id,
    ownerName: ground.users ? ground.users.name : 'Unknown Owner',
    ownerContact: ground.users ? ground.users.phone || '' : '',
    ownerWhatsapp: ground.users ? ground.users.whatsapp || '' : '',
    games: ground.games || [],
    facilities: ground.facilities || [],
    images: ground.images || [],
    rating: ground.rating || 0,
    reviewCount: ground.review_count || 0
  };
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
