
import { useState, useEffect } from "react";
import { Ground } from "@/types/models";
import { fetchGrounds, deleteGround, getMockGroundsData } from "@/services/groundsService";
import { toast } from "sonner";

interface UseGroundsDataProps {
  isSuperAdmin: boolean;
  currentUserId?: string;
}

export const useGroundsData = ({ isSuperAdmin, currentUserId }: UseGroundsDataProps) => {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGrounds = async () => {
    try {
      setLoading(true);
      const groundsData = await fetchGrounds({ 
        isSuperAdmin, 
        currentUserId 
      });
      setGrounds(groundsData);
    } catch (error) {
      console.error("Error loading grounds:", error);
      toast.error("Failed to load grounds data");
      
      // Fallback to mock data
      try {
        const mockGrounds = await getMockGroundsData(isSuperAdmin, currentUserId);
        setGrounds(mockGrounds);
      } catch (mockError) {
        console.error("Error loading mock data:", mockError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGround = async (groundId: string) => {
    try {
      await deleteGround(groundId);
      
      // Update the state after successful deletion
      setGrounds(prevGrounds => prevGrounds.filter(ground => ground.id !== groundId));
      toast.success("Ground deleted successfully");
    } catch (error) {
      console.error("Error deleting ground:", error);
      toast.error("Failed to delete ground");
    }
  };

  useEffect(() => {
    loadGrounds();
  }, [isSuperAdmin, currentUserId]);

  return {
    grounds,
    loading,
    refreshGrounds: loadGrounds,
    deleteGround: handleDeleteGround
  };
};
