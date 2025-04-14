
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Plus, Trash } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser, hasRole } from "@/utils/auth";
import { toast } from "sonner";
import { Ground } from "@/types/models";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Available sports options
const sportsOptions = [
  "Cricket",
  "Football",
  "Tennis",
  "Badminton",
  "Basketball",
  "Hockey",
  "Volleyball",
  "Table Tennis",
  "Swimming",
  "Yoga",
];

// Available facilities options
const facilitiesOptions = [
  "Drinking Water",
  "Toilet - Gents",
  "Toilet - Ladies",
  "Changing Room",
  "Shower",
  "Parking",
  "Cafeteria",
  "Seating Area",
  "First Aid Kit",
  "Locker Room",
  "Equipment Rental",
  "WiFi",
  "Air Conditioning",
];

// Generate unique ID
const generateId = () => `ground-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Form schema validation
const groundFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  games: z.array(z.string()).min(1, "Select at least one sport"),
  facilities: z.array(z.string()),
  ownerContact: z.string().min(10, "Contact number must be at least 10 characters"),
  ownerWhatsapp: z.string().optional(),
  images: z.array(z.string()).min(1, "Upload at least one image"),
});

type GroundFormValues = z.infer<typeof groundFormSchema>;

const AddEditGround: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const isEditing = !!id;
  const currentUser = getCurrentUser();
  const isSuperAdmin = hasRole('super_admin');
  
  // Initialize form with default values
  const form = useForm<GroundFormValues>({
    resolver: zodResolver(groundFormSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      games: [],
      facilities: [],
      ownerContact: currentUser?.phone || "",
      ownerWhatsapp: "",
      images: [],
    },
  });

  useEffect(() => {
    // If editing, fetch ground data
    if (isEditing) {
      const fetchGroundData = async () => {
        try {
          // In a real app, this would be an API call
          setTimeout(async () => {
            const { grounds } = await import("@/data/mockData");
            const ground = grounds.find(g => g.id === id);
            
            if (!ground) {
              toast.error("Ground not found");
              navigate("/admin/grounds");
              return;
            }
            
            // Check if user has permission to edit this ground
            if (!isSuperAdmin && ground.ownerId !== currentUser?.id) {
              toast.error("You don't have permission to edit this ground");
              navigate("/admin/grounds");
              return;
            }
            
            // Fill form with ground data
            form.reset({
              name: ground.name,
              address: ground.address,
              description: ground.description,
              games: ground.games,
              facilities: ground.facilities,
              ownerContact: ground.ownerContact,
              ownerWhatsapp: ground.ownerWhatsapp,
              images: ground.images,
            });
            
            setSelectedImages(ground.images);
            setLoading(false);
          }, 500);
        } catch (error) {
          console.error("Error fetching ground data:", error);
          toast.error("Failed to load ground data");
          setLoading(false);
        }
      };
      
      fetchGroundData();
    }
  }, [id, isEditing, form, navigate, currentUser, isSuperAdmin]);
  
  const onSubmit = (values: GroundFormValues) => {
    try {
      // Create or update ground data
      const groundData: Partial<Ground> = {
        name: values.name,
        address: values.address,
        description: values.description,
        games: values.games,
        facilities: values.facilities,
        ownerContact: values.ownerContact,
        ownerWhatsapp: values.ownerWhatsapp || values.ownerContact,
        images: values.images,
        ownerId: currentUser?.id || "",
        ownerName: currentUser?.name || "",
        location: { lat: 0, lng: 0 }, // This would normally be set via a map component
      };
      
      if (isEditing) {
        // In a real app, this would be an API call to update the ground
        toast.success(`Ground "${values.name}" updated successfully`);
      } else {
        // In a real app, this would be an API call to create a new ground
        groundData.id = generateId();
        toast.success(`Ground "${values.name}" created successfully`);
      }
      
      // Redirect back to grounds list
      setTimeout(() => {
        navigate("/admin/grounds");
      }, 1500);
    } catch (error) {
      console.error("Error saving ground:", error);
      toast.error("Failed to save ground");
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, this would upload the file to a server
    // For now, we'll just simulate an upload with a timeout
    
    // Create a preview for the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
    
    setTimeout(() => {
      // Simulate a successful upload
      const newImagePath = `/placeholder.svg`;
      setSelectedImages(prev => [...prev, newImagePath]);
      form.setValue("images", [...form.getValues("images"), newImagePath]);
      setImagePreview(null);
      toast.success("Image uploaded successfully");
    }, 1000);
  };
  
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
    form.setValue("images", updatedImages);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/grounds")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Edit Ground" : "Add New Ground"}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? "Update ground information and facilities"
                : "Create a new sports ground on the platform"}
            </p>
          </div>
        </div>
        
        <Button
          className="flex items-center"
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Update Ground" : "Save Ground"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-gray-500">Loading ground data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide the basic details about the sports ground
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-4">
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
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full address" {...field} />
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
                              placeholder="Describe the ground, its features, and surroundings"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sports & Facilities</CardTitle>
                <CardDescription>
                  Select the sports available at this ground and its facilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Available Sports</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {sportsOptions.map((sport) => (
                        <div key={sport} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sport-${sport}`}
                            checked={form.getValues("games").includes(sport)}
                            onCheckedChange={(checked) => {
                              const currentGames = form.getValues("games");
                              if (checked) {
                                form.setValue("games", [...currentGames, sport]);
                              } else {
                                form.setValue(
                                  "games",
                                  currentGames.filter((game) => game !== sport)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`sport-${sport}`}>{sport}</Label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.games && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.games.message}
                      </p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="mb-2 block">Facilities & Amenities</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {facilitiesOptions.map((facility) => (
                        <div key={facility} className="flex items-center space-x-2">
                          <Checkbox
                            id={`facility-${facility}`}
                            checked={form.getValues("facilities").includes(facility)}
                            onCheckedChange={(checked) => {
                              const currentFacilities = form.getValues("facilities");
                              if (checked) {
                                form.setValue("facilities", [...currentFacilities, facility]);
                              } else {
                                form.setValue(
                                  "facilities",
                                  currentFacilities.filter((f) => f !== facility)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`facility-${facility}`}>{facility}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Provide contact details for ground booking and inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ownerContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ownerWhatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Number (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="WhatsApp number if different"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ground Images</CardTitle>
                <CardDescription>
                  Upload photos of the ground (min. 1 required)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group rounded-md overflow-hidden h-24">
                        <img
                          src={image}
                          alt={`Ground ${index+1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {imagePreview && (
                      <div className="relative rounded-md overflow-hidden h-24 bg-gray-100 flex items-center justify-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </div>
                    )}
                    
                    <Label htmlFor="image-upload" className="border-2 border-dashed border-gray-300 rounded-md h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                      <Plus className="h-6 w-6 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-1">Add Image</span>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Label>
                  </div>
                  
                  {form.formState.errors.images && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.images.message}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Upload clear images of the ground. First image will be used as the main image.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AddEditGround;
