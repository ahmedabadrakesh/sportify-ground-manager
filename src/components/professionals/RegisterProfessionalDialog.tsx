import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StepperForm } from "./components/StepperForm";
import { FormNavigation } from "./components/FormNavigation";
import { StepContentRenderer } from "./components/StepContentRenderer";
import { useRegisterProfessionalForm } from "./hooks/useRegisterProfessionalForm";
import { getCurrentUser } from "@/utils/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hasRoleSync } from "@/utils/auth";

interface RegisterProfessionalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasExistingProfile?: boolean;
  isUpdate?: boolean;
  professional?: any;
}

const RegisterProfessionalDialog = ({
  open,
  onOpenChange,
  hasExistingProfile = false,
  isUpdate = false,
  professional,
}: RegisterProfessionalProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [existingProfileData, setExistingProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const isSuperAdmin = hasRoleSync("super_admin");

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
      setCurrentUser(user);

      if (!user && open) {
        toast.error("Please log in to register as a sports professional");
        onOpenChange(false);
      }
    };

    if (open) {
      checkAuth();
    }
  }, [open, onOpenChange]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (professional && professional.user_id) {
        // Fetch email from users table for the professional being edited
        try {
          const { data: userData, error } = await supabase
            .from("users")
            .select("email")
            .eq("id", professional.user_id)
            .single();

          if (userData && !error) {
            setUserEmail(userData.email);
          }
        } catch (error) {
          console.error("Error fetching professional's email:", error);
        }
      } else if (currentUser && !isSuperAdmin && !professional) {
        // Fetch email for current user when creating new profile
        try {
          const { data: userData, error } = await supabase
            .from("users")
            .select("email")
            .eq("id", currentUser.id)
            .single();

          if (userData && !error) {
            setUserEmail(userData.email);
          }
        } catch (error) {
          console.error("Error fetching user email:", error);
        }
      }
    };

    fetchUserEmail();
  }, [currentUser, isSuperAdmin, professional]);

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (isUpdate && currentUser && open && !isSuperAdmin && !professional) {
        setIsLoadingProfile(true);
        try {
          console.log("Fetching existing profile for user:", currentUser);

          let userId = currentUser.id;

          if ("phone" in currentUser && currentUser.phone) {
            console.log(
              "Phone user detected, looking up user record by phone:",
              currentUser.phone
            );
            const { data: existingUser, error: userError } = await supabase
              .from("users")
              .select("id")
              .eq("phone", currentUser.phone)
              .single();

            if (userError) {
              console.error("Error finding user by phone:", userError);
              if (userError.code !== "PGRST116") {
                throw userError;
              }
            } else if (existingUser) {
              userId = existingUser.id;
              console.log("Found user record with ID:", userId);
            }
          }

          console.log(
            "Searching for professional profile with user_id:",
            userId
          );
          let { data: profile, error } = await supabase
            .from("sports_professionals")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

          if (error) {
            console.error("Error fetching existing profile by user_id:", error);
            throw error;
          }

          if (!profile) {
            console.log(
              "No profile found by user_id, searching by contact info..."
            );
            const contactQueries = [];

            if (userEmail) {
              contactQueries.push(
                supabase
                  .from("sports_professionals")
                  .select("*")
                  .eq("contact_number", userEmail)
                  .maybeSingle()
              );
            }

            if (currentUser.phone) {
              contactQueries.push(
                supabase
                  .from("sports_professionals")
                  .select("*")
                  .eq("contact_number", currentUser.phone)
                  .maybeSingle()
              );
            }

            for (const query of contactQueries) {
              const { data: contactProfile, error: contactError } = await query;
              if (contactError) {
                console.error("Error searching by contact:", contactError);
                continue;
              }
              if (contactProfile) {
                console.log("Found profile by contact info:", contactProfile);
                profile = contactProfile;

                const { error: linkError } = await supabase
                  .from("sports_professionals")
                  .update({ user_id: userId })
                  .eq("id", contactProfile.id);

                if (linkError) {
                  console.error("Error linking profile to user:", linkError);
                } else {
                  console.log("Successfully linked profile to user");
                  profile.user_id = userId;
                }
                break;
              }
            }
          }

          if (profile) {
            console.log("Found existing profile:", profile);
            setExistingProfileData(profile);
          } else {
            console.log("No existing profile found for user");
            setExistingProfileData(null);
            toast.info("No existing profile found. You can create a new one.");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load existing profile");
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchExistingProfile();
  }, [isUpdate, currentUser, open, userEmail, isSuperAdmin]);

  const {
    form,
    currentStep,
    totalSteps,
    stepTitles,
    registerMutation,
    handleNext,
    handlePrevious,
    resetForm,
    onSubmit,
    stepDetails,
  } = useRegisterProfessionalForm(() => {
    onOpenChange(false);
    resetForm();
  }, isUpdate);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Form submit prevented, currentStep:",
      currentStep,
      "totalSteps:",
      totalSteps
    );

    if (currentStep === totalSteps) {
      console.log("On final step, proceeding with form submission");
      const values = form.getValues();
      onSubmit(values);
    } else {
      console.log("Not on final step, ignoring submit event");
    }
  };

  const handleSubmitButtonClick = () => {
    console.log("Submit button clicked on step:", currentStep);
    if (currentStep === totalSteps) {
      const values = form.getValues();
      onSubmit(values);
    }
  };

  useEffect(() => {
    const fillFormData = async () => {
      if (currentUser && open && !isLoadingProfile) {
        console.log("Pre-filling form data...");
        console.log("Is super admin:", isSuperAdmin);
        console.log("Is update:", isUpdate);
        console.log("Has existing profile:", hasExistingProfile);

        if (isSuperAdmin && !isUpdate) {
          console.log(
            "Super admin creating new professional - using fresh form"
          );
          form.reset({
            name: "",
            profession_type: "Athlete",
            games_played: [],
            contact_number: "",
            email: "",
            fee: 0,
            fee_type: "Per Hour",
            city: "",
            address: "",
            comments: "",
            photo: "",
            years_of_experience: undefined,
            total_match_played: undefined,
            awards: [],
            accomplishments: [],
            certifications: [],
            training_locations: [],
            videos: [],
            images: [],
            punch_line: "",
            instagram_link: "",
            facebook_link: "",
            linkedin_link: "",
            website: "",
            level: undefined,
            coaching_availability: [],
          });
        } else if (isUpdate && (existingProfileData || professional)) {
          const profileData = professional || existingProfileData;
          console.log("Pre-filling with existing data:", profileData);

          // Use form.reset with the complete object to ensure proper type handling
          form.reset({
            // Basic Info
            name: profileData.name || "",
            profession_type: profileData.profession_type || "Athlete",
            photo: profileData.photo || "",
            academy_name: profileData.academy_name || "",
            years_of_experience: profileData.years_of_experience || 0,
            games_played: [],
            is_certified: profileData.is_certified || false,

            // Contact & Social Details
            contact_number: profileData.contact_number || "",
            whatsapp: profileData.whatsapp || "",
            whatsapp_same_as_phone: profileData.whatsapp_same_as_phone || false,
            email: userEmail || "",
            instagram_link: profileData.instagram_link || "",
            youtube_link: profileData.youtube_link || "",
            linkedin_link: profileData.linkedin_link || "",
            website: profileData.website || "",
            facebook_link: profileData.facebook_link || "",

            // Professional Details
            district_level_tournaments:
              profileData.district_level_tournaments || 0,
            state_level_tournaments: profileData.state_level_tournaments || 0,
            national_level_tournaments:
              profileData.national_level_tournaments || 0,
            international_level_tournaments:
              profileData.international_level_tournaments || 0,
            specialties: profileData.specialties || [],
            certifications: profileData.certifications || [],
            education: profileData.education || [],
            accomplishments: profileData.accomplishments || [],
            training_locations_detailed:
              profileData.training_locations_detailed || [],

            // Media & Pricing
            images: profileData.images || [],
            videos: profileData.videos || [],
            one_on_one_price: profileData.one_on_one_price || 0,
            group_session_price: profileData.group_session_price || 0,
            online_price: profileData.online_price || 0,
            free_demo_call: profileData.free_demo_call || false,

            // About Me
            about_me: profileData.about_me || "",
            success_stories: profileData.success_stories || [],

            // Legacy fields
            city: profileData.city || "",
            address: profileData.address || "",
            comments: profileData.comments || "",
            fee: profileData.fee || 0,
            fee_type: profileData.fee_type || "Per Hour",
            total_match_played: profileData.total_match_played || 0,
            awards: profileData.awards || [],
            training_locations: profileData.training_locations || [],
            punch_line: profileData.punch_line || "",
            level: profileData.level || undefined,
            coaching_availability: profileData.coaching_availability || [],
          });

          // Convert game_ids to game names and set games_played
          if (
            profileData.game_ids &&
            Array.isArray(profileData.game_ids) &&
            profileData.game_ids.length > 0
          ) {
            try {
              const { data: gameData, error: gameError } = await supabase
                .from("games")
                .select("name")
                .in("id", profileData.game_ids);

              if (gameData && !gameError) {
                console.log(
                  "Setting games_played:",
                  gameData.map((game) => game.name)
                );
                form.setValue(
                  "games_played",
                  gameData.map((game) => game.name)
                );
              }
            } catch (error) {
              console.error("Error fetching game names:", error);
            }
          }

          console.log("Form values after pre-fill:", form.getValues());
        } else if (!hasExistingProfile && !isSuperAdmin) {
          console.log("Regular user creating new profile");
          form.setValue("name", currentUser.name || "");
          form.setValue("email", userEmail);

          if (currentUser.phone) {
            form.setValue("contact_number", currentUser.phone);
          }
        }
      }
    };

    if (currentUser && open && !isLoadingProfile) {
      fillFormData();
    }
  }, [
    currentUser,
    open,
    hasExistingProfile,
    form,
    isUpdate,
    existingProfileData,
    isLoadingProfile,
    userEmail,
    isSuperAdmin,
    professional,
  ]);

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
      setExistingProfileData(null);
    }
    onOpenChange(open);
  };

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const dialogTitle =
    isSuperAdmin && !isUpdate
      ? "Register New Sports Professional"
      : isUpdate
      ? "Update Your Profile"
      : "Register as Sports Professional";

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-6xl md:max-h-[90vh] p--6 border-2 border-primary rounded-4xl">
        <div className="grid md:grid-cols-8 gap-4 ">
          <div className="hidden md:block col-span-2 bg-primary ">
            <ScrollArea className="h-[calc(90vh-40px)] ">
              <DialogTitle className="text-left text-white pl-4 pb-4 pt-8">
                {dialogTitle}
              </DialogTitle>
              <hr />
              <StepperForm
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepTitles={stepTitles}
                stepDetails={stepDetails}
              />
            </ScrollArea>
          </div>
          <div className="md:col-span-6 p-6">
            {isLoadingProfile ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading profile...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="md:hidden bg-black mb-4 mt-6">
                  <StepperForm
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    stepTitles={stepTitles}
                    stepDetails={stepDetails}
                  />
                </div>
                <ScrollArea className="h-[calc(90vh-120px)]">
                  <Form {...form}>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      <div className="min-h-9/10">
                        <StepContentRenderer
                          currentStep={currentStep}
                          form={form}
                          userEmail={userEmail}
                          isUpdate={isUpdate}
                        />
                      </div>
                    </form>
                  </Form>
                </ScrollArea>
              </>
            )}
            <div>
              <FormNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmitButtonClick}
                isSubmitting={registerMutation.isPending}
                isUpdate={isUpdate}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterProfessionalDialog;
