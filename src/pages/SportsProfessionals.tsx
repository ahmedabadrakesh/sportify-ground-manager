import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import SEOHead from "@/components/SEOHead";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfessionalsList from "@/components/professionals/ProfessionalsList";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SportsProfessionals = () => {
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sportFilter = searchParams.get("sport");

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
      toast.error("Please log in first");
      navigate("/login", { state: { returnPath: "/sports-professionals" } });
      return;
    }

    if (isSuperAdmin) {
      navigate("/register-professional", { 
        state: { returnPath: "/sports-professionals" } 
      });
    } else {
      navigate(hasExistingProfile ? "/update-professional" : "/register-professional", { 
        state: { returnPath: "/sports-professionals" } 
      });
    }
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
      return `${
        sportFilter.charAt(0).toUpperCase() + sportFilter.slice(1)
      } Professionals`;
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
      <SEOHead
        title="Sports Professionals & Coaches | Jokova"
        description="Find certified sports professionals and coaches for cricket, football, tennis, badminton and more. Book training sessions with experienced sports coaches."
        keywords="sports professionals, coaches, sports training, cricket coach, football coach, tennis coach, badminton coach, personal trainer"
        canonicalUrl="https://jokova.com/sports-professionals"
      />
      {/* Hero Section */}
      <div className="bg-background border-b">
        <div className="grid md:grid-cols-8 mx-auto text-left py-4 mt-4">
          <div className="c mb-6 col-span-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Find Your Perfect Coach
            </h1>
            <p className="text-muted-foreground">
              Browse through our verified fitness professionals
            </p>
          </div>

          {shouldShowButton() && (
            <div className="md:col-span-2 justify-center text-right">
              <Button
                onClick={handleRegisterClick}
                disabled={checkingProfile}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                {checkingProfile ? "Checking..." : getButtonText()}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto py-4">
        <ProfessionalsList sportFilter={sportFilter} />
      </div>
    </MainLayout>
  );
};

export default SportsProfessionals;
