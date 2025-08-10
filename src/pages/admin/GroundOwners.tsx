import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AddOwnerForm from "@/components/admin/owners/AddOwnerForm";
import EditOwnerForm from "@/components/admin/owners/EditOwnerForm";
import DeleteOwnerDialog from "@/components/admin/owners/DeleteOwnerDialog";
import { ColumnDef } from "@tanstack/react-table";

const GroundOwners: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOwner, setEditOwner] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteOwner, setDeleteOwner] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleEditOwner = (updatedOwner: any) => {
    setOwners(prevOwners => 
      prevOwners.map(owner => 
        owner.id === updatedOwner.id ? updatedOwner : owner
      )
    );
    setIsEditDialogOpen(false);
    setEditOwner(null);
  };

  const openEditDialog = (owner: any) => {
    setEditOwner(owner);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (owner: any) => {
    setDeleteOwner(owner);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    if (deleteOwner) {
      handleDeleteOwner(deleteOwner.id);
    }
    setIsDeleteDialogOpen(false);
    setDeleteOwner(null);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div>{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div>{row.getValue("phone")}</div>
      ),
    },
    {
      accessorKey: "whatsapp",
      header: "WhatsApp",
      cell: ({ row }) => (
        <div>{row.getValue("whatsapp") || "N/A"}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const owner = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditDialog(owner)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => openDeleteDialog(owner)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

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
        <DataTable
          columns={columns}
          data={owners}
          searchKey="name"
          searchPlaceholder="Search owners..."
        />
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ground Owner</DialogTitle>
          </DialogHeader>
          {editOwner && (
            <EditOwnerForm
              ownerId={editOwner.id}
              ownerData={editOwner}
              onSuccess={handleEditOwner}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteOwnerDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        ownerId={deleteOwner?.id}
        ownerName={deleteOwner?.name}
        onConfirm={handleDeleteSuccess}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </AdminLayout>
  );
};

export default GroundOwners;