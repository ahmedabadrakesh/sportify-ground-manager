import React from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import RegisterProfessionalDialog from "@/components/professionals/RegisterProfessionalDialog";
import { ColumnDef } from "@tanstack/react-table";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";

const AdminSportsProfessionals = () => {
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = React.useState(false);
  const [editingProfessional, setEditingProfessional] =
    React.useState<any>(null);

  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync("super_admin");

  const {
    data: professionals,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-sports-professionals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sports_professionals")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleEdit = (professional: any) => {
    if (!isSuperAdmin && professional.user_id !== currentUser?.id) {
      toast.error("You can only edit your own profile");
      return;
    }
    setEditingProfessional(professional);
  };

  const handleSoftDelete = async (id: string) => {
    if (!isSuperAdmin) {
      toast.error("Only super admins can delete professional profiles");
      return;
    }

    try {
      const { error } = await supabase
        .from("sports_professionals")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Professional deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting professional:", error);
      toast.error("Failed to delete professional");
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "photo",
      header: "Photo",
      cell: ({ row }) => (
        <img
          src={row.original.photo || "/placeholder.svg"}
          alt={row.original.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      id: "sport",
      header: "Sport",
      cell: ({ row }) => {
        const count = row.original.game_ids?.length ?? 0;
        return <div>{count > 0 ? `${count} games` : "No games"}</div>;
      },
    },
    {
      accessorKey: "profession_type",
      header: "Profession Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("profession_type")}</div>
      ),
    },
    {
      id: "fee",
      header: "Fee",
      cell: ({ row }) => (
        <div>
          ₹{row.original.fee} {row.original.fee_type}
        </div>
      ),
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => <div>{row.getValue("city")}</div>,
    },
    {
      accessorKey: "contact_number",
      header: "Contact",
      cell: ({ row }) => <div>{row.getValue("contact_number")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const professional = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(professional)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {isSuperAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleSoftDelete(professional.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

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
        <div>
          <h1 className="text-2xl font-bold">Sports Professionals</h1>
          <p className="text-gray-600">
            Manage sports professionals and their profiles
          </p>
        </div>
        <Button onClick={() => setIsRegisterDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Professional
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={professionals || []}
        searchKey="name"
        searchPlaceholder="Search professionals..."
      />
      <RegisterProfessionalDialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
        isUpdate={false}
      />
      ̦
      {editingProfessional && (
        <RegisterProfessionalDialog
          open={!!editingProfessional}
          onOpenChange={() => setEditingProfessional(null)}
          isUpdate={true}
          professional={editingProfessional}
        />
      )}
    </AdminLayout>
  );
};

export default AdminSportsProfessionals;
