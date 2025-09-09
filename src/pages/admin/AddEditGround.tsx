import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Ground } from "@/types/models";
import { grounds } from "@/data/mockData";
import { getCurrentUserSync } from "@/utils/auth";

const groundFormSchema = z.object({
  name: z.string().min(2, {
    message: "Ground name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  latitude: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= -90 && num <= 90;
  }, {
    message: "Latitude must be a valid number between -90 and 90.",
  }),
  longitude: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= -180 && num <= 180;
  }, {
    message: "Longitude must be a valid number between -180 and 180.",
  }),
  games: z.string().min(3, {
    message: "Please enter at least one game.",
  }),
  facilities: z.string().min(3, {
    message: "Please enter at least one facility.",
  }),
  ownerWhatsapp: z.string().optional(),
});

type GroundFormValues = z.infer<typeof groundFormSchema>;

const AddEditGround: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentGround, setCurrentGround] = useState<Ground | null>(null);
  const isEditMode = !!params.id;
  
  const currentUser = getCurrentUserSync();
  
  const form = useForm<GroundFormValues>({
    resolver: zodResolver(groundFormSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      latitude: "",
      longitude: "",
      games: "",
      facilities: "",
      ownerWhatsapp: "",
    },
  });
  
  useEffect(() => {
    if (isEditMode && params.id) {
      setIsLoading(true);
      
      // Simulate API call to fetch ground data
      setTimeout(() => {
        const ground = grounds.find(g => g.id === params.id);
        
        if (ground) {
          setCurrentGround(ground);
          
          // Set default form values for editing
          form.reset({
            name: ground.name,
            description: ground.description,
            address: ground.address,
            latitude: ground.location.lat.toString(),
            longitude: ground.location.lng.toString(),
            games: ground.games.join(', '),
            facilities: ground.facilities.join(', '),
            ownerWhatsapp: ground.ownerWhatsapp || '',
          });
        } else {
          toast.error("Ground not found");
          navigate('/admin/grounds');
        }
        
        setIsLoading(false);
      }, 500);
    }
  }, [isEditMode, params.id, navigate, form]);

  const onSubmit = (values: GroundFormValues) => {
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Convert values to Ground object
        const groundData: Partial<Ground> = {
          name: values.name,
          description: values.description,
          address: values.address,
          location: {
            lat: parseFloat(values.latitude),
            lng: parseFloat(values.longitude),
          },
          games: values.games.split(',').map(game => game.trim()),
          facilities: values.facilities.split(',').map(facility => facility.trim()),
          images: [], // Would be handled by file upload in real app
          ownerId: currentUser?.id || '',
          ownerName: currentUser?.name || '',
          ownerContact: currentUser?.email || '',
          ownerWhatsapp: values.ownerWhatsapp,
        };
        
        if (isEditMode && currentGround) {
          // Update existing ground
          const updatedGround = { ...currentGround, ...groundData };
          const groundIndex = grounds.findIndex(g => g.id === currentGround.id);
          
          if (groundIndex !== -1) {
            grounds[groundIndex] = updatedGround as Ground;
            toast.success("Ground updated successfully");
          }
        } else {
          // Create new ground
          const newGround: Ground = {
            id: `ground-${Date.now()}`,
            ...groundData as any,
            rating: 0,
            reviewCount: 0,
            images: ["https://placehold.co/600x400?text=Ground+Image"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          grounds.push(newGround);
          toast.success("Ground created successfully");
        }
        
        // Redirect back to grounds list
        navigate('/admin/grounds');
      } catch (error) {
        console.error("Error saving ground:", error);
        toast.error("Failed to save ground. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading ground data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? "Edit Ground" : "Add New Ground"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update the details of the selected ground."
            : "Add a new sports ground to the platform."}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter latitude" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter longitude" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter ground description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="games"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Games (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter games" {...field} />
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
                      <FormLabel>Facilities (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter facilities" {...field} />
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
                      <FormLabel>Owner WhatsApp Number (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter WhatsApp number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save Ground"}
          </Button>
        </form>
      </Form>
    </AdminLayout>
  );
};

export default AddEditGround;
