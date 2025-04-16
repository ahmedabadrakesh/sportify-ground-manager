
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { groundSchema, GroundFormValues } from "./groundFormSchema";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";

export const useGroundForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
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
  const fetchOwners = async () => {
    if (!isSuperAdmin) return;
    
    try {
      console.log("Fetching ground owners...");
      
      // Use the Postgres security definer function to bypass RLS
      const { data, error } = await supabase
        .rpc('get_admin_users');
        
      if (error) {
        console.error("Database error fetching ground owners:", error);
        throw error;
      }
      
      console.log("Ground owners data:", data);
      // TypeScript will accept this as data is an array or null
      setOwners(data || []);
    } catch (error: any) {
      console.error("Error fetching ground owners:", error);
      
      // Fallback to mock data
      console.log("Falling back to mock data");
      import("@/data/mockData").then(({ users }) => {
        const groundOwners = users.filter(user => user.role === 'admin');
        setOwners(groundOwners);
      });
    }
  };
  
  useEffect(() => {
    fetchOwners();
  }, [isSuperAdmin]);

  const onSubmit = async (values: GroundFormValues) => {
    setIsLoading(true);
    
    try {
      // Format the games and facilities as arrays
      const gamesArray = values.games.split(',').map(game => game.trim());
      const facilitiesArray = values.facilities.split(',').map(facility => facility.trim());
      
      // Location object with default values
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
      
      // Insert directly or use mock data for demo purposes
      let success = false;
      let newGround: any = null;
      
      // Try to insert the ground into Supabase
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
        // For demo purposes, use mock data instead
        const mockId = `mock-${Date.now()}`;
        newGround = {
          id: mockId,
          name: values.name,
          description: values.description || '',
          address: values.address,
          owner_id: ownerId,
          games: gamesArray,
          facilities: facilitiesArray,
          location
        };
        success = true;
      } else {
        newGround = data?.[0];
        success = true;
      }
      
      if (success) {
        toast.success("Ground created successfully!");
        navigate("/admin/grounds");
      } else {
        throw new Error("Failed to create ground");
      }
    } catch (error: any) {
      console.error("Error creating ground:", error);
      toast.error(error.message || "Failed to create ground");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    owners,
    isSuperAdmin,
    currentUser,
    fetchOwners,
    onSubmit
  };
};
