import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StepperForm } from "@/components/professionals/components/StepperForm";
import { FormNavigation } from "@/components/professionals/components/FormNavigation";
import { StepContentRenderer } from "@/components/professionals/components/StepContentRenderer";
import { useRegisterProfessionalForm } from "@/components/professionals/hooks/useRegisterProfessionalForm";
import { getCurrentUser } from "@/utils/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hasRoleSync } from "@/utils/auth";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const RegisterProfessional = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [existingProfileData, setExistingProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const isUpdate = !!id;
  const isSuperAdmin = hasRoleSync("super_admin");
  
  // Get the return path from location state or default to previous page
  const returnPath = location.state?.returnPath || "/sports-professionals";

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
      setCurrentUser(user);

      if (!user) {
        toast.error("Please log in to register as a sports professional");
        navigate("/login", { state: { returnPath: location.pathname } });
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (existingProfileData && existingProfileData.user_id) {
        // Fetch email from users table for the professional being edited
        try {
          const { data: userData, error } = await supabase
            .from("users")
            .select("email")
            .eq("id", existingProfileData.user_id)
            .single();

          if (userData && !error) {
            setUserEmail(userData.email);
          }
        } catch (error) {
          console.error("Error fetching professional's email:", error);
        }
      } else if (currentUser && !isSuperAdmin && !existingProfileData) {
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
  }, [currentUser, isSuperAdmin, existingProfileData]);

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (isUpdate && currentUser && !isSuperAdmin) {
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
      } else if (isUpdate && isSuperAdmin && id) {
        // Fetch profile by ID for super admin
        setIsLoadingProfile(true);
        try {
          const { data: profile, error } = await supabase
            .from("sports_professionals")
            .select("*")
            .eq("id", id)
            .single();

          if (error) {
            console.error("Error fetching profile by ID:", error);
            toast.error("Failed to load professional profile");
            navigate(returnPath);
            return;
          }

          setExistingProfileData(profile);
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load professional profile");
          navigate(returnPath);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    if (currentUser) {
      fetchExistingProfile();
    }
  }, [isUpdate, currentUser, userEmail, isSuperAdmin, id, navigate, returnPath]);

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
    toast.success(isUpdate ? "Profile updated successfully!" : "Registration completed successfully!");
    navigate(returnPath);
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
      if (currentUser && !isLoadingProfile) {
        console.log("Pre-filling form data...");
        console.log("Is super admin:", isSuperAdmin);
        console.log("Is update:", isUpdate);

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
        } else if (isUpdate && existingProfileData) {
          const profileData = existingProfileData;
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
        } else if (!isUpdate && !isSuperAdmin) {
          console.log("Regular user creating new profile");
          form.setValue("name", currentUser.name || "");
          form.setValue("email", userEmail);

          if (currentUser.phone) {
            form.setValue("contact_number", currentUser.phone);
          }
        }
      }
    };

    if (currentUser && !isLoadingProfile) {
      fillFormData();
    }
  }, [
    currentUser,
    form,
    isUpdate,
    existingProfileData,
    isLoadingProfile,
    userEmail,
    isSuperAdmin,
  ]);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const pageTitle =
    isSuperAdmin && !isUpdate
      ? "Register New Sports Professional"
      : isUpdate
      ? "Update Your Profile"
      : "Register as Sports Professional";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <div className="bg-white border-b border-border/20 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(returnPath)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <Link to="/" className="inline-block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  SportifyGround
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Container */}
          <div className="bg-gradient-to-r from-primary/95 to-primary/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-8 min-h-[90vh]">
              {/* Left Panel - Stepper Navigation */}
              <div className="lg:col-span-2 p-8 text-white flex flex-col">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">{pageTitle}</h2>
                  <p className="text-white/90 text-sm">
                    Complete all steps to {isUpdate ? "update your" : "create your"} sports professional profile
                  </p>
                </div>
                
                <div className="flex-1">
                  <StepperForm
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    stepTitles={stepTitles}
                    stepDetails={stepDetails}
                  />
                </div>
              </div>

              {/* Right Panel - Form Content */}
              <div className="lg:col-span-6 bg-white p-8 flex flex-col">
                {isLoadingProfile ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-lg font-medium text-foreground">Loading profile...</p>
                      <p className="text-sm text-muted-foreground">Please wait while we fetch your information</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1 pr-4">
                      <Form {...form}>
                        <form onSubmit={handleFormSubmit} className="space-y-8">
                          <StepContentRenderer
                            currentStep={currentStep}
                            form={form}
                            userEmail={userEmail}
                            isUpdate={isUpdate}
                          />
                        </form>
                      </Form>
                    </ScrollArea>
                    
                    <div className="mt-8 pt-6 border-t border-border">
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterProfessional;