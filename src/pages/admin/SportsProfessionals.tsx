
import React from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import RegisterProfessionalDialog from "@/components/professionals/RegisterProfessionalDialog";

const AdminSportsProfessionals = () => {
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = React.useState(false);

  const { data: professionals, isLoading } = useQuery({
    queryKey: ["admin-sports-professionals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sports_professionals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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
        <h1 className="text-2xl font-bold">Sports Professionals</h1>
        <Button onClick={() => setIsRegisterDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Professional
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
                <TableCell>{professional.game_ids && professional.game_ids.length > 0 ? professional.game_ids.length + ' games' : 'No games'}</TableCell>
                <TableCell>{professional.profession_type}</TableCell>
                <TableCell>₹{professional.fee} {professional.fee_type}</TableCell>
                <TableCell>{professional.city}</TableCell>
                <TableCell>{professional.contact_number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RegisterProfessionalDialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
        isUpdate={false}
      />
    </AdminLayout>
  );
};

export default AdminSportsProfessionals;
