
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b">
        <div className="container mx-auto py-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {getPageDescription()}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge variant="outline" className="px-3 py-1">
                  1000+ Professionals
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  All Sports
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Verified Coaches
                </Badge>
              </div>
            </div>
            {shouldShowButton() && (
              <div className="flex-shrink-0">
                <Button 
                  onClick={handleRegisterClick} 
                  disabled={checkingProfile}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg"
                >
                  {checkingProfile ? "Checking..." : getButtonText()}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
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
