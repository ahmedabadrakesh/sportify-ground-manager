
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProfessionalsList from "@/components/professionals/ProfessionalsList";
import RegisterProfessionalDialog from "@/components/professionals/RegisterProfessionalDialog";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SportsProfessionals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [searchParams] = useSearchParams();
  const sportFilter = searchParams.get('sport');

  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync("super_admin");
  const isSportsProfessional = hasRoleSync("sports_professional");

  // Check if current user already has a professional profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!currentUser) {
        setCheckingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sports_professionals")
          .select("id")
          .eq("user_id", currentUser.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "not found" error
          throw error;
        }

        setHasExistingProfile(!!data);
      } catch (error) {
        console.error("Error checking existing profile:", error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkExistingProfile();
  }, [currentUser]);

  const handleRegisterClick = () => {
    if (!currentUser) {
      toast.error("Please login to register as a professional");
      return;
    }

    setIsDialogOpen(true);
  };

  const getButtonText = () => {
    if (!currentUser) return "Login to Register";
    if (isSuperAdmin) return "Add Professional";
    if (hasExistingProfile) return "Update Your Profile";
    if (isSportsProfessional) return "Update Your Profile";
    return "Register as Professional";
  };

  const shouldShowButton = () => {
    if (!currentUser) return true; // Show login prompt
    if (isSuperAdmin) return true; // Super admin can always add
    return true; // All logged-in users can register or update
  };

  const isUpdateMode = () => {
    return (isSportsProfessional || hasExistingProfile) && !isSuperAdmin;
  };

  const getPageTitle = () => {
    if (sportFilter) {
      return `${sportFilter.charAt(0).toUpperCase() + sportFilter.slice(1)} Professionals`;
    }
    return "Sports Professionals";
  };

  const getPageDescription = () => {
    if (sportFilter) {
      return `Find experienced ${sportFilter} professionals or register yourself`;
    }
    return "Find experienced sports professionals or register yourself";
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-left">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600">
              {getPageDescription()}
            </p>
          </div>
          {shouldShowButton() && (
            <Button onClick={handleRegisterClick} disabled={checkingProfile}>
              {checkingProfile ? "Checking..." : getButtonText()}
            </Button>
          )}
        </div>

        <ProfessionalsList sportFilter={sportFilter} />

        <RegisterProfessionalDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          hasExistingProfile={hasExistingProfile}
          isUpdate={isUpdateMode()}
        />
      </div>
    </MainLayout>
  );
};

export default SportsProfessionals;
