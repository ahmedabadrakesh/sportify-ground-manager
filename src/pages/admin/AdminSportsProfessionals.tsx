
import React from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import RegisterProfessionalDialog from "@/components/professionals/RegisterProfessionalDialog";
import EditProfessionalDialog from "@/components/admin/professionals/EditProfessionalDialog";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";

const AdminSportsProfessionals = () => {
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = React.useState(false);
  const [editingProfessional, setEditingProfessional] = React.useState<any>(null);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync("super_admin");
  const isSportsProfessional = hasRoleSync("sports_professional");

  const {
    data: professionals,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-sports-professionals"],
    queryFn: async () => {
      let query = supabase
        .from("sports_professionals")
        .select(
          `
          *
        `
        )
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (isSportsProfessional && !isSuperAdmin) {
        query = query.eq("user_id", currentUser?.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

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
      toast.success("Professional deleted (soft) successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting professional:", error);
      toast.error("Failed to delete professional");
    }
  };

  const handleEdit = (professional: any) => {
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

  type Professional = any;

  const columns = React.useMemo<ColumnDef<Professional>[]>(
    () => [
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
        header: ({ column }) => (
          <button
            className="inline-flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "sport",
        header: ({ column }) => (
          <button
            className="inline-flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sport <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        sortingFn: (a, b) => {
          const al = (a.original.game_ids?.length ?? 0) as number;
          const bl = (b.original.game_ids?.length ?? 0) as number;
          return al - bl;
        },
        cell: ({ row }) => {
          const count = row.original.game_ids?.length ?? 0;
          return count > 0 ? `${count} games` : "No games";
        },
      },
      {
        accessorKey: "profession_type",
        header: ({ column }) => (
          <button
            className="inline-flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Profession Type <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
      },
      {
        id: "fee",
        header: ({ column }) => (
          <button
            className="inline-flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fee <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        sortingFn: (a, b) => Number(a.original.fee ?? 0) - Number(b.original.fee ?? 0),
        cell: ({ row }) => `₹${row.original.fee} ${row.original.fee_type}`,
      },
      {
        accessorKey: "city",
        header: ({ column }) => (
          <button
            className="inline-flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            City <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
      },
      {
        accessorKey: "contact_number",
        header: "Contact",
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(row.original)}
              disabled={!isSuperAdmin && row.original.user_id !== currentUser?.id}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            {isSuperAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSoftDelete(row.original.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        ),
      },
    ],
    [currentUser?.id, isSuperAdmin]
  );

  const table = useReactTable({
    data: professionals || [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">
          {isSportsProfessional && !isSuperAdmin ? "My Profile" : "Sports Professionals"}
        </h1>
        <div className="flex w-full gap-3 md:w-auto">
          <Input
            placeholder="Search name, city, contact..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleAddProfessional}>
            <Plus className="w-4 h-4 mr-2" />
            {isSportsProfessional && !isSuperAdmin ? "Create My Profile" : "Add Professional"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6 text-gray-500">
                  No professionals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} result(s)
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
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
