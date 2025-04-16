
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";

// Define the form schema
const groundSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  ownerId: z.string().uuid("Please select a ground owner"),
  games: z.string().min(1, "Please enter at least one game"),
  facilities: z.string().min(1, "Please enter at least one facility"),
});

type GroundFormValues = z.infer<typeof groundSchema>;

const AddGround: React.FC = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isSuperAdmin = hasRoleSync('super_admin');
  const currentUser = getCurrentUserSync();
  
  // Initialize form
  const form = useForm<GroundFormValues>({
    resolver: zodResolver(groundSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      ownerId: isSuperAdmin ? "" : currentUser?.id || "",
      games: "",
      facilities: "",
    },
  });

  // Fetch ground owners for super admin
  useEffect(() => {
    const fetchOwners = async () => {
      if (!isSuperAdmin) return;
      
      try {
        const { data, error } = await supabase.rpc('get_admin_users');
        
        if (error) {
          console.error("Error fetching ground owners:", error);
          toast.error("Failed to fetch ground owners");
          return;
        }
        
        setOwners(data || []);
      } catch (error) {
        console.error("Error fetching ground owners:", error);
        toast.error("Failed to fetch ground owners");
      }
    };
    
    fetchOwners();
  }, [isSuperAdmin]);

  const onSubmit = async (values: GroundFormValues) => {
    setIsLoading(true);
    
    try {
      // Get the current user's session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to create a ground");
        navigate("/login");
        return;
      }
      
      // Format the games and facilities as arrays
      const gamesArray = values.games.split(',').map(game => game.trim());
      const facilitiesArray = values.facilities.split(',').map(facility => facility.trim());
      
      // Use placeholder location values - in a real app, you'd want to get these from a map component
      const location = {
        lat: 0,
        lng: 0
      };
      
      // Determine the owner ID (current user ID for regular admins, selected owner for super admins)
      const ownerId = isSuperAdmin ? values.ownerId : currentUser?.id;
      
      if (!ownerId) {
        throw new Error("Owner ID is required");
      }
      
      console.log("Inserting ground with owner_id:", ownerId);
      
      // Insert the ground into Supabase
      const { data, error } = await supabase
        .from('grounds')
        .insert({
          name: values.name,
          description: values.description,
          address: values.address,
          owner_id: ownerId,
          games: gamesArray,
          facilities: facilitiesArray,
          location
        })
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || "Failed to create ground");
      }
      
      toast.success("Ground created successfully!");
      navigate("/admin/grounds");
    } catch (error: any) {
      console.error("Error creating ground:", error);
      toast.error(error.message || "Failed to create ground");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate("/admin/grounds")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Ground</h1>
            <p className="text-gray-600">Create a new sports ground</p>
          </div>
        </div>

        <div className="bg-white rounded-md shadow p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ground Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ground name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {isSuperAdmin && (
                  <FormField
                    control={form.control}
                    name="ownerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ground Owner</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ground owner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {owners.map((owner) => (
                              <SelectItem key={owner.id} value={owner.id}>
                                {owner.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ground address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the ground" 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="games"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Games</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Cricket, Football, etc. (comma separated)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="facilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facilities</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Parking, Canteen, etc. (comma separated)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => navigate("/admin/grounds")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Ground"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddGround;
