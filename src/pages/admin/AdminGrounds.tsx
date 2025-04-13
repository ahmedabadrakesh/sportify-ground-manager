
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit, Trash, MapPin, User, Grid3X3 } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { grounds } from "@/data/mockData";
import { getCurrentUser, hasRole } from "@/utils/auth";
import { toast } from "sonner";

const AdminGrounds: React.FC = () => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGroundId, setSelectedGroundId] = useState<string | null>(null);
  
  const currentUser = getCurrentUser();
  const isSuperAdmin = hasRole('super_admin');
  
  // Filter grounds based on user role
  const userGrounds = isSuperAdmin
    ? grounds
    : grounds.filter(ground => ground.ownerId === currentUser?.id);

  const handleDeleteGround = () => {
    if (!selectedGroundId) return;
    
    // In a real app, we would call an API to delete the ground
    const groundName = grounds.find(ground => ground.id === selectedGroundId)?.name;
    toast.success(`Ground "${groundName}" deleted successfully`);
    setIsDeleteDialogOpen(false);
    setSelectedGroundId(null);
  };

  // Function to get the correct image path for display
  const getDisplayImagePath = (imagePath: string) => {
    return imagePath.startsWith("public/") ? imagePath.substring(7) : imagePath;
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

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ground Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Sports</TableHead>
                {isSuperAdmin && <TableHead>Owner</TableHead>}
                <TableHead>Facilities</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userGrounds.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isSuperAdmin ? 6 : 5}
                    className="text-center py-6 text-gray-500"
                  >
                    No grounds found
                  </TableCell>
                </TableRow>
              ) : (
                userGrounds.map((ground) => (
                  <TableRow key={ground.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                          <img
                            src={getDisplayImagePath(ground.images[0] || "/placeholder.svg")}
                            alt={ground.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{ground.name}</div>
                          <div className="text-xs text-gray-500">ID: {ground.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{ground.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {ground.games.map((game) => (
                          <Badge key={game} variant="outline" className="text-xs">
                            {game}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    {isSuperAdmin && (
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{ground.ownerName}</span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Grid3X3 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {ground.facilities.length} facilities
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => navigate(`/admin/grounds/edit/${ground.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Dialog
                          open={isDeleteDialogOpen && selectedGroundId === ground.id}
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open);
                            if (!open) setSelectedGroundId(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setSelectedGroundId(ground.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Ground</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this ground? This action
                                cannot be undone and all associated bookings will be
                                cancelled.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteGround}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGrounds;
