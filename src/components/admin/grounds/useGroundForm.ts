
import { useState } from "react";
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
      // For super admin, fetch all admin users to assign as ground owner
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('role', 'admin');
      
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

  const onSubmit = async (values: GroundFormValues) => {
    setIsLoading(true);
    
    try {
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
