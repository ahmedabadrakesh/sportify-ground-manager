
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import GroundsTable from "@/components/grounds/GroundsTable";
import { Ground } from "@/types/models";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";

const AdminGrounds: React.FC = () => {
  const navigate = useNavigate();
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  useEffect(() => {
    // Fetch grounds data from API
    const fetchGrounds = async () => {
      try {
        // In a real app, this would be an API call
        // For demo, we'll simulate API fetch with timeout
        setTimeout(() => {
          // Import dynamically to avoid circular dependencies
          import("@/data/mockData").then(({ grounds }) => {
            // Filter grounds based on user role
            const userGrounds = isSuperAdmin
              ? grounds
              : grounds.filter(ground => ground.ownerId === currentUser?.id);
            
            setGrounds(userGrounds);
            setLoading(false);
          });
        }, 500);
      } catch (error) {
        console.error("Error fetching grounds:", error);
        toast.error("Failed to load grounds data");
        setLoading(false);
      }
    };
    
    fetchGrounds();
  }, [currentUser, isSuperAdmin]);
  
  const handleDeleteGround = (groundId: string) => {
    // In a real app, we would call an API to delete the ground
    // For demo, we'll just update the state
    setGrounds(prevGrounds => prevGrounds.filter(ground => ground.id !== groundId));
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
