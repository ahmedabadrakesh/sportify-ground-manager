
import React, { useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import GroundsHeader from "@/components/admin/grounds/GroundsHeader";
import GroundsLoading from "@/components/admin/grounds/GroundsLoading";
import { useGroundsData } from "@/hooks/useGroundsData";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Ground } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminGrounds: React.FC = () => {
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("No active Supabase session found. Using local auth fallback.");
      }
    };
    
    checkAuth();
  }, []);
  
  const { grounds, loading, deleteGround } = useGroundsData({
    isSuperAdmin,
    currentUserId: currentUser?.id
  });

  const navigate = useNavigate();

  const handleEdit = (groundId: string) => {
    navigate(`/admin/grounds/${groundId}/edit`);
  };

  const handleDelete = async (groundId: string) => {
    if (window.confirm("Are you sure you want to delete this ground?")) {
      await deleteGround(groundId);
    }
  };

  const columns: ColumnDef<Ground>[] = [
    {
      accessorKey: "name",
      header: "Ground Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Location",
      cell: ({ row }) => (
        <div className="max-w-xs truncate">{row.getValue("address")}</div>
      ),
    },
    {
      accessorKey: "games",
      header: "Sports",
      cell: ({ row }) => {
        const games = row.getValue("games") as string[];
        return <div className="max-w-xs truncate">{games?.join(", ") || "N/A"}</div>;
      },
    },
    ...(isSuperAdmin ? [{
      accessorKey: "owner_id",
      header: "Owner",
      cell: ({ row }: { row: any }) => (
        <div className="font-mono text-sm">
          {row.getValue("owner_id")?.toString().slice(0, 8)}...
        </div>
      ),
    }] : []),
    {
      accessorKey: "facilities",
      header: "Facilities",
      cell: ({ row }) => {
        const facilities = row.getValue("facilities") as string[];
        return <div className="max-w-xs truncate">{facilities?.join(", ") || "N/A"}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const ground = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(ground.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(ground.id)}
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
      <GroundsHeader isSuperAdmin={isSuperAdmin} />

      {loading ? (
        <GroundsLoading />
      ) : (
        <DataTable
          columns={columns}
          data={grounds}
          searchKey="name"
          searchPlaceholder="Search grounds..."
        />
      )}
    </AdminLayout>
  );
};

export default AdminGrounds;
