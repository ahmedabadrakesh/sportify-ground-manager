import React from "react";
import { Link } from "react-router-dom";
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
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/95389000-89d9-41a2-9e40-b2ad99632b9e.png"
              alt="JOKOVA Logo"
              className="h-10 w-auto mr-2"
              style={{ background: "transparent", borderRadius: "4px", padding: "0" }}
            />
            <span className="text-xl font-bold text-primary-800">JOKOVA</span>
          </Link>
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <NavItems isSuperAdmin={isSuperAdmin} />
        </ScrollArea>
        
        <UserProfile userName={userName} userRole={userRole} />
      </div>
    </div>
  );
};

export default Sidebar;
