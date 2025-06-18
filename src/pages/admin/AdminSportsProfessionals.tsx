
import React from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { toast } from "sonner";
import RegisterProfessionalDialog from "@/components/professionals/RegisterProfessionalDialog";
import EditProfessionalDialog from "@/components/admin/professionals/EditProfessionalDialog";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";

const AdminSportsProfessionals = () => {
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = React.useState(false);
  const [editingProfessional, setEditingProfessional] = React.useState<any>(null);
  
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  const isSportsProfessional = hasRoleSync('sports_professional');

  const { data: professionals, isLoading } = useQuery({
    queryKey: ["admin-sports-professionals"],
    queryFn: async () => {
      let query = supabase
        .from("sports_professionals")
        .select(`
          *,
          games (
            name
          )
        `)
        .order("created_at", { ascending: false });

      // If user is a sports professional, only show their own profile
      if (isSportsProfessional && !isSuperAdmin) {
        query = query.eq('user_id', currentUser?.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    if (!isSuperAdmin) {
      toast.error("Only super admins can delete professional profiles");
      return;
    }

    try {
      const { error } = await supabase
        .from('sports_professionals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Professional deleted successfully");
    } catch (error) {
      console.error("Error deleting professional:", error);
      toast.error("Failed to delete professional");
    }
  };

  const handleEdit = (professional: any) => {
    // Check if user can edit this profile
    if (!isSuperAdmin && professional.user_id !== currentUser?.id) {
      toast.error("You can only edit your own profile");
      return;
    }
    setEditingProfessional(professional);
  };

  const handleAddProfessional = () => {
    if (!isSuperAdmin && !isSportsProfessional) {
      toast.error("Only sports professionals can register profiles");
      return;
    }
    setIsRegisterDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isSportsProfessional && !isSuperAdmin ? "My Profile" : "Sports Professionals"}
        </h1>
        <Button onClick={handleAddProfessional}>
          <Plus className="w-4 h-4 mr-2" />
          {isSportsProfessional && !isSuperAdmin ? "Create My Profile" : "Add Professional"}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Profession Type</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals?.map((professional) => (
              <TableRow key={professional.id}>
                <TableCell>
                  <img 
                    src={professional.photo || "/placeholder.svg"} 
                    alt={professional.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{professional.name}</TableCell>
                <TableCell>{professional.games?.name}</TableCell>
                <TableCell>{professional.profession_type}</TableCell>
                <TableCell>₹{professional.fee} {professional.fee_type}</TableCell>
                <TableCell>{professional.city}</TableCell>
                <TableCell>{professional.contact_number}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(professional)}
                      disabled={!isSuperAdmin && professional.user_id !== currentUser?.id}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    {isSuperAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(professional.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RegisterProfessionalDialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
      />

      {editingProfessional && (
        <EditProfessionalDialog
          open={!!editingProfessional}
          onOpenChange={() => setEditingProfessional(null)}
          professional={editingProfessional}
        />
      )}
    </AdminLayout>
  );
};

export default AdminSportsProfessionals;
