
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchGroundOwners, createGround } from "@/services/groundFormService";
import { groundSchema, GroundFormValues } from "./groundFormSchema";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";

export const useGroundForm = (images?: File[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');

  const form = useForm<GroundFormValues>({
    resolver: zodResolver(groundSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      games: [],
      facilities: [],
      ownerId: ""
    },
  });

  const fetchOwners = async () => {
    try {
      const data = await fetchGroundOwners();
      setOwners(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
      toast.error("Failed to load ground owners");
    }
  };

  const onSubmit = async (values: GroundFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await createGround({ 
        values, 
        isSuperAdmin, 
        currentUserId: currentUser?.id,
        images: images
      });
      
      if (result) {
        toast.success("Ground created successfully");
        navigate("/admin/grounds");
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
    fetchOwners,
    onSubmit
  };
};
