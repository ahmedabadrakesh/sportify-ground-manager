
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavItems from "./NavItems";
import UserProfile from "./UserProfile";

interface SidebarProps {
  userName: string;
  userRole: string;
  isSuperAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userName, 
  userRole, 
  isSuperAdmin 
}) => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white">
        {/* Removed logo section */}

        <ScrollArea className="flex-1 px-3">
          <NavItems isSuperAdmin={isSuperAdmin} />
        </ScrollArea>
        
        <UserProfile userName={userName} userRole={userRole} />
      </div>
    </div>
  );
};

export default Sidebar;

