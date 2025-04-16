
import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AddOwnerForm from "@/components/admin/owners/AddOwnerForm";
import OwnerTable from "@/components/admin/owners/OwnerTable";

const GroundOwners: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching ground owners...");
        
        // Use the Postgres security definer function to bypass RLS
        const { data, error } = await supabase
          .rpc('get_admin_users');
          
        if (error) {
          console.error("Database error fetching ground owners:", error);
          throw error;
        }
        
        console.log("Ground owners data:", data);
        // TypeScript will accept this as data is an array or null
        setOwners(data || []);
      } catch (error: any) {
        console.error("Error fetching ground owners:", error);
        setError(error.message || "Failed to load ground owners");
        
        // Fallback to mock data
        console.log("Falling back to mock data");
        import("@/data/mockData").then(({ users }) => {
          const groundOwners = users.filter(user => user.role === 'admin');
          setOwners(groundOwners);
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOwners();
  }, []);

  if (!hasRoleSync('super_admin')) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page.
          </p>
        </div>
      </AdminLayout>
    );
  }

  const handleAddOwnerSuccess = (newOwner: any) => {
    setOwners(prevOwners => [...prevOwners, newOwner]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteOwner = (ownerId: string) => {
    setOwners(prevOwners => prevOwners.filter(owner => owner.id !== ownerId));
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ground Owners</h1>
          <p className="text-gray-600">
            Manage ground owners and their access permissions.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Ground Owner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <AddOwnerForm 
              onSuccess={handleAddOwnerSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error loading ground owners</p>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2">Using fallback data for demo purposes.</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading ground owners data...</p>
        </div>
      ) : (
        <OwnerTable 
          owners={owners}
          onDeleteOwner={handleDeleteOwner}
        />
      )}
    </AdminLayout>
  );
};

export default GroundOwners;
