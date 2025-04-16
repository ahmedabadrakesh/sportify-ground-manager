
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import GroundsTable from "@/components/grounds/GroundsTable";
import { Ground } from "@/types/models";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminGrounds: React.FC = () => {
  const navigate = useNavigate();
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  useEffect(() => {
    fetchGrounds();
  }, []);
  
  // Fetch grounds from Supabase
  const fetchGrounds = async () => {
    try {
      setLoading(true);
      console.log("Fetching grounds data...");
      
      // Try to fetch grounds directly first
      let { data, error } = await supabase
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
          users:owner_id (name, phone, whatsapp)
        `);
      
      // If not super admin, only fetch grounds owned by the current user
      if (!isSuperAdmin && currentUser?.id) {
        data = data?.filter(ground => ground.owner_id === currentUser.id) || [];
      }
      
      if (error) {
        console.error("Error fetching grounds:", error);
        // If there's an error, fall back to mock data 
        import("@/data/mockData").then(({ grounds: mockGrounds }) => {
          console.log("Using mock ground data");
          const filteredGrounds = isSuperAdmin 
            ? mockGrounds 
            : mockGrounds.filter(ground => ground.ownerId === currentUser?.id);
          setGrounds(filteredGrounds);
          setLoading(false);
        });
        return;
      }
      
      console.log("Ground data fetched:", data);
      
      // Transform the data to match the Ground model
      const formattedGrounds: Ground[] = data.map(ground => {
        // Ensure location has lat and lng properties
        let locationObj = { lat: 0, lng: 0 };
        
        // If location exists and is an object with lat/lng, use it
        if (ground.location && typeof ground.location === 'object') {
          const loc = ground.location as Record<string, any>;
          if ('lat' in loc && 'lng' in loc) {
            locationObj = {
              lat: Number(loc.lat),
              lng: Number(loc.lng)
            };
          }
        }
        
        return {
          id: ground.id,
          name: ground.name,
          description: ground.description || '',
          address: ground.address,
          location: locationObj,
          ownerId: ground.owner_id,
          ownerName: ground.users?.name || 'Unknown Owner',
          ownerContact: ground.users?.phone || '',
          ownerWhatsapp: ground.users?.whatsapp || '',
          games: ground.games || [],
          facilities: ground.facilities || [],
          images: ground.images || [],
          rating: ground.rating || 0,
          reviewCount: ground.review_count || 0
        };
      });
      
      setGrounds(formattedGrounds);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grounds:", error);
      toast.error("Failed to load grounds data");
      setLoading(false);
    }
  };
  
  const handleDeleteGround = async (groundId: string) => {
    try {
      const { error } = await supabase
        .from('grounds')
        .delete()
        .eq('id', groundId);
      
      if (error) {
        console.error("Error deleting ground:", error);
        toast.error("Failed to delete ground");
        return;
      }
      
      // Update the state after successful deletion
      setGrounds(prevGrounds => prevGrounds.filter(ground => ground.id !== groundId));
      toast.success("Ground deleted successfully");
    } catch (error) {
      console.error("Error deleting ground:", error);
      toast.error("Failed to delete ground");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grounds</h1>
          <p className="text-gray-600">
            {isSuperAdmin
              ? "Manage all sports grounds across the platform"
              : "Manage your sports grounds"}
          </p>
        </div>
        
        <Button
          className="flex items-center"
          onClick={() => navigate("/admin/grounds/add")}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Ground
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading grounds data...</p>
        </div>
      ) : (
        <GroundsTable 
          grounds={grounds}
          isSuperAdmin={isSuperAdmin}
          onDeleteGround={handleDeleteGround}
        />
      )}
    </AdminLayout>
  );
};

export default AdminGrounds;
