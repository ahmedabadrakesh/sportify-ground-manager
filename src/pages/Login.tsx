import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { login } from "@/utils/auth";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileProgressDialog from "@/components/professionals/ProfileProgressDialog";
import RegisterProfessionalDialog from "@/components/professionals/RegisterProfessionalDialog";
import { supabase } from "@/integrations/supabase/client";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [showUserTypeDialog, setShowUserTypeDialog] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const [selectedUserType, setSelectedUserType] = useState<'user' | 'sports_professional'>('user');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    // Simple form validation
    if (!identifier || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    console.log("Attempting login with:", identifier);

    // Login functionality
    try {
      const user = await login(identifier, password);

      if (user) {
        toast.success(`Welcome back, ${user.name}!`);

        // Show progress dialog for sports professionals
        if (user.role === "sports_professional") {
          setLoggedInUserId(user.id);
          setShowProgressDialog(true);
          return; // Don't navigate yet, let dialog handle it
        }

        // Redirect based on user role
        if (user.role === "admin" || user.role === "super_admin") {
          navigate("/admin");
        } else if (user.role === "ground_owner") {
          navigate("/admin/grounds"); // Ground owners go to grounds page
        } else {
          navigate("/");
        }
      } else {
        setLoginError(
          "Invalid credentials. Please check your username/email and password."
        );
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError("Authentication error. Please try again.");
      toast.error("Authentication error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleUpdateProfile = () => {
    setIsUpdateDialogOpen(true);
  };

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google OAuth flow...');
      console.log('Redirect URL:', `${window.location.origin}/login`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      console.log('Google OAuth response:', { data, error });
      
      if (error) {
        console.error('Google OAuth error details:', error);
        toast.error(`Google login failed: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(`Google login failed: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle the OAuth callback and user type selection
  useEffect(() => {
    const handleAuthChange = async (event: any, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Check if user already exists in our database
          const { data: existingUser, error } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          if (existingUser && !error) {
            // User exists, log them in normally
            localStorage.setItem('currentUser', JSON.stringify(existingUser));
            toast.success(`Welcome back, ${existingUser.name}!`);
            
            if (existingUser.role === "sports_professional") {
              setLoggedInUserId(existingUser.id);
              setShowProgressDialog(true);
              return;
            }
            
            if (existingUser.role === "admin" || existingUser.role === "super_admin") {
              navigate("/admin");
            } else if (existingUser.role === "ground_owner") {
              navigate("/admin/grounds");
            } else {
              navigate("/");
            }
          } else {
            // New user, show user type selection
            setGoogleUserData(session.user);
            setShowUserTypeDialog(true);
          }
        } catch (error) {
          console.error('Error handling Google auth:', error);
          toast.error('Authentication error. Please try again.');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleUserTypeSelection = async () => {
    if (!googleUserData) return;
    
    try {
      const userData = {
        auth_id: googleUserData.id,
        name: googleUserData.user_metadata?.full_name || googleUserData.email?.split('@')[0] || 'User',
        email: googleUserData.email,
        phone: googleUserData.phone || null,
        role: selectedUserType
      };

      const { data: newUser, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        toast.error('Failed to create user profile. Please try again.');
        return;
      }

      // Create sports professional entry if needed
      if (selectedUserType === 'sports_professional') {
        // Get first available game
        const { data: games } = await supabase
          .from('games')
          .select('id')
          .limit(1)
          .single();

        if (games) {
          await supabase
            .from('sports_professionals')
            .insert([{
              user_id: newUser.id,
              name: userData.name,
              profession_type: 'Coach',
              game_ids: [games.id],
              contact_number: googleUserData.phone || '',
              fee: 0,
              fee_type: 'Per Hour',
              address: '',
              city: ''
            }]);
        }
      }

      localStorage.setItem('currentUser', JSON.stringify(newUser));
      toast.success(`Welcome to SportifyGround, ${newUser.name}!`);
      setShowUserTypeDialog(false);

      if (selectedUserType === 'sports_professional') {
        setLoggedInUserId(newUser.id);
        setShowProgressDialog(true);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast.error('Failed to complete registration. Please try again.');
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
          <p className="text-muted-foreground mt-2">Welcome back to your sports hub</p>
        </div>

        {/* Main Container */}
        <div className="bg-gradient-to-r from-primary/95 to-primary/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Panel - Welcome Content */}
            <div className="p-12 text-white flex flex-col justify-center space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Sign in to access your account and continue booking amazing sports grounds, 
                  connecting with professionals, and managing your sporting activities.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/90">Book premium sports facilities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/90">Connect with sports professionals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/90">Track your bookings & activities</span>
                </div>
              </div>

              {/* Demo Accounts Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-semibold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                  Demo Accounts Available
                </h3>
                <div className="space-y-2 text-sm text-white/90">
                  <div><strong>Super Admin:</strong> sa@123456 <span className="text-white/70">(password: 1234)</span></div>
                  <div><strong>Admin:</strong> a@123456 <span className="text-white/70">(password: 1234)</span></div>
                </div>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="bg-white p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Sign In</h3>
                  <p className="text-muted-foreground">Enter your credentials to access your account</p>
                </div>

                {loginError && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive font-medium">{loginError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="identifier" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="identifier"
                      type="email"
                      placeholder="you@example.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="h-12"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-4 text-muted-foreground font-medium">Or continue with</span>
                    </div>
                  </div>

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
                    Continue with Google
                  </Button>
                </form>

                <div className="mt-8 text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-primary hover:text-primary/80"
                    >
                      Create account
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
                Please select whether you're a regular user or a sports professional.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <RadioGroup 
                value={selectedUserType} 
                onValueChange={(value: 'user' | 'sports_professional') => setSelectedUserType(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user-type" />
                  <Label htmlFor="user-type">Regular User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sports_professional" id="professional-type" />
                  <Label htmlFor="professional-type">Sports Professional</Label>
                </div>
              </RadioGroup>
              {selectedUserType === 'sports_professional' && (
                <p className="text-xs text-blue-600">
                  A basic sports professional profile will be created for you, which you can update later.
                </p>
              )}
              <Button onClick={handleUserTypeSelection} className="w-full">
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Profile Progress Dialog for Sports Professionals */}
        {loggedInUserId && (
          <ProfileProgressDialog
            isOpen={showProgressDialog}
            onClose={() => {
              setShowProgressDialog(false);
              navigate("/"); // Navigate to home after closing dialog
            }}
            userId={loggedInUserId}
            setIsUpdateDialogOpen={setIsUpdateDialogOpen}
          />
        )}

        {/* Dialogs */}
        {isUpdateDialogOpen && (
          <RegisterProfessionalDialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
            hasExistingProfile={true}
            isUpdate={true}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
