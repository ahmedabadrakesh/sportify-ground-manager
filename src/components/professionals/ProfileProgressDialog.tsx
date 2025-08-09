import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import CircularProgress from "./CircularProgress";
import { useNavigate } from "react-router-dom";

interface ProfileProgressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ProfileProgressDialog: React.FC<ProfileProgressDialogProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfessionalData();
    }
  }, [isOpen, userId]);

  const fetchProfessionalData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("sports_professionals")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching professional data:", error);
        return;
      }

      setProfessional(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = () => {
    onClose();
    navigate("/sports-professionals");
  };

  const handleSkip = () => {
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Don't show dialog if no professional profile exists
  if (!professional) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Complete Your Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your sports professional profile is incomplete. Complete it to get more visibility and attract more clients!
            </p>
          </div>

          <CircularProgress 
            professional={professional}
            handleUpdateProfile={handleUpdateProfile}
          />

          <div className="flex space-x-3 w-full">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1"
            >
              Skip for Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileProgressDialog;