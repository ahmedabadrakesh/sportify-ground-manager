
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { register } from "@/utils/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationType, setRegistrationType] = useState<"email" | "phone">("email");
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegistrationError(null);

    // Simple form validation
    if (!name || (!email && !phone) || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Basic validation for phone number format
    if (registrationType === "phone" && phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        toast.error("Please enter a valid 10-digit mobile number");
        setIsLoading(false);
        return;
      }
    }

    // Registration logic
    try {
      const user = await register(name, registrationType === "email" ? email : "", registrationType === "phone" ? phone : "", password);
      
      if (user) {
        toast.success("Registration successful! You are now logged in.");
        navigate("/");
      } else {
        toast.error("Registration failed. Please try again with different credentials.");
        setRegistrationError("Registration failed. Please try with different credentials.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific error messages
      if (error.message?.includes("phone_provider_disabled")) {
        setRegistrationError("Phone number registration is currently disabled. Please use email instead.");
        toast.error("Phone registration is disabled. Please register with email.");
      } else if (error.message?.includes("over_email_send_rate_limit")) {
        setRegistrationError("Too many registration attempts. Please try again later.");
        toast.error("Email rate limit exceeded. Please try again later.");
      } else {
        setRegistrationError("An error occurred during registration. Using demo mode.");
        toast.error("Using demo mode for registration.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-800">SportifyGround</h1>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Register to book sports grounds and track your reservations
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {registrationError && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                <p>{registrationError}</p>
                <p className="text-xs mt-1">Note: You will be registered in demo mode if Supabase auth is unavailable.</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <Tabs defaultValue="email" onValueChange={(value) => setRegistrationType(value as "email" | "phone")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={registrationType === "email"}
                  />
                </TabsContent>
                
                <TabsContent value="phone" className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={registrationType === "phone"}
                  />
                  <p className="text-xs text-gray-500">
                    Enter your 10-digit mobile number without country code
                  </p>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="text-sm text-gray-500">
                By registering, you agree to our{" "}
                <Link to="/terms" className="text-primary-600 hover:text-primary-800">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-800">
                  Privacy Policy
                </Link>
                .
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>
              
              <div className="text-xs text-center text-gray-500 mt-2">
                Note: If registration with Supabase fails, you'll be registered in demo mode.
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center w-full">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-800"
                >
                  Login
                </Link>
              </span>
            </div>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
