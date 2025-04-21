
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavItems from "./NavItems";
import UserProfile from "./UserProfile";

const LOGO_PATH = "/lovable-uploads/c9d204d2-6de6-4a97-855d-f2acf0bd0180.png";

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
        <div className="flex items-center justify-center mb-4">
          <img
            src={LOGO_PATH}
            alt="JOKOVA Logo"
            className="h-12 w-auto rounded"
            style={{ background: "#fff" }}
          />
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
