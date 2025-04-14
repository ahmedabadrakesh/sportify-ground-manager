
import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash, User, Mail, Phone } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasRole } from "@/utils/auth";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

// Connect to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Added a function to generate a unique ID
const generateId = () => `owner-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const GroundOwners: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
  });

  useEffect(() => {
    // Fetch ground owners data
    const fetchOwners = async () => {
      try {
        setLoading(true);
        // Fetch data from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'admin');
          
        if (error) {
          throw error;
        }
        
        setOwners(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ground owners:", error);
        toast.error("Failed to load ground owners");
        
        // Fallback to mock data if Supabase connection fails
        setTimeout(() => {
          import("@/data/mockData").then(({ users }) => {
            // Filter users to only show admins (ground owners)
            const groundOwners = users.filter(user => user.role === 'admin');
            setOwners(groundOwners);
            setLoading(false);
          });
        }, 500);
      }
    };
    
    fetchOwners();
  }, []);

  // Check if the current user is a super admin
  if (!hasRole('super_admin')) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      // Create new owner object
      const newOwner = {
        id: generateId(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        role: 'admin',
      };
      
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      
      if (authError) {
        throw authError;
      }
      
      // Then add to the users table with the auth ID
      const { error } = await supabase
        .from('users')
        .insert([{
          ...newOwner,
          auth_id: authData.user?.id,
        }]);
        
      if (error) {
        throw error;
      }
      
      // Update state with new owner
      setOwners(prevOwners => [...prevOwners, newOwner]);
      
      toast.success(`Ground owner ${formData.name} added successfully`);
      
      // Reset form and close dialog
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        password: "",
      });
      
    } catch (error: any) {
      console.error("Error adding ground owner:", error);
      toast.error(error.message || "Failed to add ground owner");
    }
  };

  const handleDeleteOwner = async () => {
    if (!selectedOwnerId) return;
    
    try {
      // Find owner to delete
      const ownerToDelete = owners.find(owner => owner.id === selectedOwnerId);
      if (!ownerToDelete) {
        toast.error("Owner not found");
        return;
      }
      
      // Delete from Supabase
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedOwnerId);
        
      if (error) {
        throw error;
      }
      
      // Update state by removing the owner
      setOwners(prevOwners => prevOwners.filter(owner => owner.id !== selectedOwnerId));
      
      toast.success(`Ground owner ${ownerToDelete.name} deleted successfully`);
      
      // Reset state and close dialog
      setIsDeleteDialogOpen(false);
      setSelectedOwnerId(null);
      
    } catch (error: any) {
      console.error("Error deleting ground owner:", error);
      toast.error(error.message || "Failed to delete ground owner");
    }
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
            <DialogHeader>
              <DialogTitle>Add New Ground Owner</DialogTitle>
              <DialogDescription>
                Create a new account for a ground owner with management access.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddOwner} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="555-123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    placeholder="555-123-4567"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a temporary password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  The owner will be prompted to change this on first login.
                </p>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Account</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading ground owners data...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {owners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No ground owners found
                  </TableCell>
                </TableRow>
              ) : (
                owners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">{owner.name}</div>
                          <div className="text-xs text-gray-500">ID: {owner.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{owner.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{owner.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Dialog
                          open={isDeleteDialogOpen && selectedOwnerId === owner.id}
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open);
                            if (!open) setSelectedOwnerId(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setSelectedOwnerId(owner.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Ground Owner</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this ground owner? This action cannot be
                                undone and all associated grounds and bookings will need to be
                                reassigned.
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
                                onClick={handleDeleteOwner}
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
      )}
    </AdminLayout>
  );
};

export default GroundOwners;
