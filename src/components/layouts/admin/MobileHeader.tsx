
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavItems from "./NavItems";
import UserProfile from "./UserProfile";

interface MobileHeaderProps {
  userName: string;
  userRole: string;
  isSuperAdmin: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  userName, 
  userRole, 
  isSuperAdmin 
}) => {
  return (
    <div className="md:hidden bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Removed logo section */}
        
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                Menu <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center">
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
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <NavItems isSuperAdmin={isSuperAdmin} />
                </ScrollArea>
                
                <UserProfile userName={userName} userRole={userRole} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;

