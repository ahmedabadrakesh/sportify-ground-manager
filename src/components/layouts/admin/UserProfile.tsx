
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logout } from "@/utils/auth";

interface UserProfileProps {
  userName: string;
  userRole: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userName, userRole }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center mb-2">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="font-medium text-gray-600">
            {userName.charAt(0)}
          </span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700">{userName}</p>
          <p className="text-xs text-gray-500 capitalize">{userRole.replace('_', ' ')}</p>
        </div>
      </div>
      
      <div className="flex justify-between space-x-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4 mr-2" /> Home
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
