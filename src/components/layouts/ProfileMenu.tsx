import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Key, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/utils/auth";
import { toast } from "sonner";
import ResetPasswordDialog from "@/components/auth/ResetPasswordDialog";

interface ProfileMenuProps {
  userName: string;
  userRole: string;
  isSuperAdmin: boolean;
  userEmail?: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userName,
  userRole,
  isSuperAdmin,
  userEmail,
}) => {
  const navigate = useNavigate();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  const handleResetPassword = () => {
    setShowResetDialog(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-secondary text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-background border shadow-lg z-50"
        align="end"
        forceMount
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-secondary text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {userRole.replace("_", " ")}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {isSuperAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin/dashboard" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={handleResetPassword}
          className="cursor-pointer"
        >
          <Key className="mr-2 h-4 w-4" />
          <span>Reset Password</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ResetPasswordDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        userEmail={userEmail}
      />
    </DropdownMenu>
  );
};

export default ProfileMenu;
