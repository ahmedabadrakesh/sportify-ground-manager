import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { register, login } from "@/utils/auth";
import ProfileProgressDialog from "@/components/professionals/ProfileProgressDialog";
import RegisterProfessionalDialog from "@/components/professionals/RegisterProfessionalDialog";
import { supabase } from "@/integrations/supabase/client";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"user" | "sports_professional">(
    "user"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileProgressDialogOpen, setIsProfileProgressDialogOpen] =
    useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [showUserTypeDialog, setShowUserTypeDialog] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const [selectedUserType, setSelectedUserType] = useState<
    "user" | "sports_professional"
  >("user");

  // Use a ref to track if submission is in progress
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Form submission triggered");
    console.log("Current form state:", {
      name,
      email,
      password,
      confirmPassword,
      userType,
    });
    console.log(
      "isLoading:",
      isLoading,
      "isSubmittingRef.current:",
      isSubmittingRef.current
    );

    // Prevent multiple submissions using ref (more reliable than state)
    if (isLoading || isSubmittingRef.current) {
      console.log("Registration already in progress, ignoring submission");
      return;
    }

    // Set the ref immediately to block any other submissions
    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      // Simple form validation
      if (!name || !email || !password || !confirmPassword) {
        console.log("Validation failed: missing required fields");
        toast.error("Please fill in all required fields");
        return;
      }

      if (password !== confirmPassword) {
        console.log("Validation failed: passwords don't match");
        toast.error("Passwords do not match");
        return;
      }

      // Basic validation for email format
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          console.log("Validation failed: invalid email format");
          toast.error("Please enter a valid email address");
          return;
        }
      }

      console.log("Starting registration with:", {
        name,
        email,
        userType,
      });

      const user = await register(name, email, "", password, userType);

      console.log("Registration result:", user);

      if (user) {
        console.log("Registration successful, user:", user);

        // Auto-login the user after successful registration
        try {
          const loginIdentifier = email;
          const loggedInUser = await login(loginIdentifier, password);

          if (loggedInUser) {
            const successMessage =
              userType === "sports_professional"
                ? "Registration successful! Your sports professional profile has been created. Welcome to SportifyGround!"
                : "Registration successful! Welcome to SportifyGround!";

            toast.success(successMessage);

            // Show profile progress dialog for sports professionals
            if (userType === "sports_professional") {
              setRegisteredUser(loggedInUser);
              setIsProfileProgressDialogOpen(true);
            } else {
              navigate("/");
            }
          } else {
            throw new Error("Auto-login failed");
          }
        } catch (loginError) {
          console.error("Auto-login error:", loginError);
          toast.success("Registration successful! Please login to continue.");
          navigate("/login");
        }
      } else {
        console.log("Registration failed: no user returned");
        toast.error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle specific error messages
      if (error.message?.includes("User already registered")) {
        toast.error(
          "This email is already registered. Please use a different email or try logging in."
        );
      } else if (error.message?.includes("email_address_invalid")) {
        toast.error("Please enter a valid email address.");
      } else if (error.message?.includes("password")) {
        toast.error("Password must be at least 6 characters long.");
      } else if (error.message?.includes("phone_provider_disabled")) {
        toast.error(
          "Phone number registration is currently disabled. Please use email instead."
        );
      } else if (
        error.message?.includes("rate limit") ||
        error.status === 429 ||
        error.code === "over_email_send_rate_limit"
      ) {
        toast.error(
          "Too many registration attempts. Please wait a few minutes before trying again."
        );
      } else if (error.message?.includes("No games available")) {
        toast.error(
          "Sports professional registration is temporarily unavailable. Please contact support."
        );
      } else {
        toast.error(
          error.message ||
            "Registration failed. Please check your details and try again."
        );
      }
    } finally {
      console.log("Registration process completed, resetting loading state");
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
    try {
      console.log("Starting Google OAuth flow...");
      console.log("Redirect URL:", `${window.location.origin}/register`);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/register`,
        },
      });

      console.log("Google OAuth response:", { data, error });

      if (error) {
        console.error("Google OAuth error details:", error);
        toast.error(`Google registration failed: ${error.message}`);
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(
        `Google registration failed: ${error.message || "Unknown error"}`
      );
    }
  };

  // Handle the OAuth callback and user type selection
  useEffect(() => {
    const handleAuthChange = async (event: any, session: any) => {
      if (event === "SIGNED_IN" && session?.user) {
        try {
          // Check if user already exists in our database
          const { data: existingUser, error } = await supabase
            .from("users")
            .select("*")
            .eq("auth_id", session.user.id)
            .single();

          if (existingUser && !error) {
            // User exists, redirect to login
            localStorage.setItem("currentUser", JSON.stringify(existingUser));
            toast.success(
              `Welcome back, ${existingUser.name}! Redirecting to home...`
            );
            navigate("/");
          } else {
            // New user, show user type selection
            setGoogleUserData(session.user);
            setShowUserTypeDialog(true);
          }
        } catch (error) {
          console.error("Error handling Google auth:", error);
          toast.error("Authentication error. Please try again.");
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleUserTypeSelection = async () => {
    if (!googleUserData) return;

    try {
      const userData = {
        auth_id: googleUserData.id,
        name:
          googleUserData.user_metadata?.full_name ||
          googleUserData.email?.split("@")[0] ||
          "User",
        email: googleUserData.email,
        phone: googleUserData.phone || null,
        role: selectedUserType,
      };

      const { data: newUser, error } = await supabase
        .from("users")
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error("Error creating user:", error);
        toast.error("Failed to create user profile. Please try again.");
        return;
      }

      // Create sports professional entry if needed
      if (selectedUserType === "sports_professional") {
        // Get first available game
        const { data: games } = await supabase
          .from("games")
          .select("id")
          .limit(1)
          .single();

        if (games) {
          await supabase.from("sports_professionals").insert([
            {
              user_id: newUser.id,
              name: userData.name,
              profession_type: "Coach",
              game_ids: [games.id],
              contact_number: googleUserData.phone || "",
              fee: 0,
              fee_type: "Per Hour",
              address: "",
              city: "",
            },
          ]);
        }
      }

      localStorage.setItem("currentUser", JSON.stringify(newUser));
      toast.success(`Welcome to SportifyGround, ${newUser.name}!`);
      setShowUserTypeDialog(false);

      if (selectedUserType === "sports_professional") {
        setRegisteredUser(newUser);
        setIsProfileProgressDialogOpen(true);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
      toast.error("Failed to complete registration. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              SportifyGround
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2">
            Join the ultimate sports community
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-gradient-to-r from-primary/95 to-primary/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[700px]">
            {/* Left Panel - Welcome Content */}
            <div className="p-12 text-white flex flex-col justify-center space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Join SportifyGround</h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Create your account to unlock access to premium sports
                  facilities, connect with professional coaches, and manage your
                  sporting journey.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/90">
                    Access to 100+ premium facilities
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/90">
                    Connect with certified professionals
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/90">
                    Real-time booking & scheduling
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/90">
                    Join sports events & tournaments
                  </span>
                </div>
              </div>

              {/* Registration Tips */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-semibold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                  Quick Registration Tip
                </h3>
                <p className="text-sm text-white/90">
                  Choose "Sports Professional" if you're a coach, trainer, or
                  instructor looking to offer your services. You can always
                  update your profile later!
                </p>
              </div>
            </div>

            {/* Right Panel - Registration Form */}
            <div className="bg-white p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Create Account
                  </h3>
                  <p className="text-muted-foreground">
                    Register to start your sports journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="google"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 488 512"
                    >
                      <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
                      />
                    </svg>
                    Register with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-primary-700 border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-4 text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Account Type</Label>
                    <RadioGroup
                      value={userType}
                      onValueChange={(value: "user" | "sports_professional") =>
                        setUserType(value)
                      }
                      disabled={isLoading}
                      className="grid grid-cols-1 gap-3"
                    >
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/5">
                        <RadioGroupItem value="user" id="user" />
                        <Label
                          htmlFor="user"
                          className="font-normal cursor-pointer"
                        >
                          Regular User - Book grounds & events
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/5">
                        <RadioGroupItem
                          value="sports_professional"
                          id="sports_professional"
                        />
                        <Label
                          htmlFor="sports_professional"
                          className="font-normal cursor-pointer"
                        >
                          Sports Professional - Offer services
                        </Label>
                      </div>
                    </RadioGroup>
                    {userType === "sports_professional" && (
                      <p className="text-xs text-primary/70 bg-primary/5 p-2 rounded">
                        A basic profile will be created for you to get started
                        quickly.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-sm font-medium"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    By creating an account, you agree to our{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-8 text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-primary hover:text-primary/80"
                    >
                      Sign in
                    </Link>
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Forgot your password?{" "}
                    <Link
                      to="/forgot-password"
                      className="font-medium text-primary hover:text-primary/80"
                    >
                      Reset it here
                    </Link>
                  </p>

                  <Button
                    variant="ghost"
                    className="text-sm"
                    onClick={() => navigate("/")}
                  >
                    ← Back to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Type Selection Dialog */}
        <Dialog open={showUserTypeDialog} onOpenChange={setShowUserTypeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Account Type</DialogTitle>
              <DialogDescription>
                Please select whether you're a regular user or a sports
                professional.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <RadioGroup
                value={selectedUserType}
                onValueChange={(value: "user" | "sports_professional") =>
                  setSelectedUserType(value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user-register-type" />
                  <Label htmlFor="user-register-type">Regular User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="sports_professional"
                    id="professional-register-type"
                  />
                  <Label htmlFor="professional-register-type">
                    Sports Professional
                  </Label>
                </div>
              </RadioGroup>
              {selectedUserType === "sports_professional" && (
                <p className="text-xs text-blue-600">
                  A basic sports professional profile will be created for you,
                  which you can update later.
                </p>
              )}
              <Button onClick={handleUserTypeSelection} className="w-full">
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Profile Progress Dialog for Sports Professionals */}
        {registeredUser && (
          <ProfileProgressDialog
            isOpen={isProfileProgressDialogOpen}
            onClose={() => {
              setIsProfileProgressDialogOpen(false);
              navigate("/sports-professionals");
            }}
            userId={registeredUser.id}
            setIsUpdateDialogOpen={setIsUpdateDialogOpen}
          />
        )}

        {/* Register Professional Dialog */}
        {registeredUser && (
          <RegisterProfessionalDialog
            open={isUpdateDialogOpen}
            onOpenChange={(open) => {
              setIsUpdateDialogOpen(open);
              if (!open) {
                setIsProfileProgressDialogOpen(false);
                navigate("/sports-professionals");
              }
            }}
            isUpdate={true}
          />
        )}
      </div>
    </div>
  );
};

export default Register;
