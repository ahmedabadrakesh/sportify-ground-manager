
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/utils/auth";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple form validation
    if (!identifier || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Login functionality
    try {
      const user = await login(identifier, password);
      
      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        
        // Redirect based on user role
        if (user.role === 'admin' || user.role === 'super_admin') {
          navigate('/admin');
        } else if (user.role === 'ground_owner') {
          navigate('/admin/grounds'); // Ground owners go to grounds page
        } else {
          navigate('/');
        }
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-800">SportifyGround</h1>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="email" onValueChange={(value) => setLoginMethod(value as "email" | "phone")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="identifier">
                    {loginMethod === "email" ? "Email" : "Phone Number"}
                  </Label>
                  <Input
                    id="identifier"
                    type={loginMethod === "email" ? "email" : "tel"}
                    placeholder={loginMethod === "email" ? "you@example.com" : "10-digit mobile number"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete={loginMethod === "email" ? "email" : "tel"}
                  />
                </div>
              </Tabs>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              
              <div className="text-sm text-gray-500 text-center mt-6">
                For demo purposes, use:
                <ul className="mt-1">
                  <li><strong>User:</strong> john@example.com</li>
                  <li><strong>Admin:</strong> a@123456 (password: 1234)</li>
                  <li><strong>Super Admin:</strong> sa@123456 (password: 1234)</li>
                  <li><strong>Ground Owner:</strong> Any registered ground owner (password: 123456)</li>
                </ul>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center w-full">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-800"
                >
                  Register
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

export default Login;
