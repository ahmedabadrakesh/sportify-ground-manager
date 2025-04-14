
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, LogOut, Package, Calendar, Users, Map, 
  LayoutDashboard, ChevronRight, ShoppingBag 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getCurrentUserSync, logout, hasRoleSync } from "@/utils/auth";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const NavItems = () => (
    <div className="space-y-1">
      <Link
        to="/admin"
        className={`flex items-center px-3 py-2 text-sm rounded-md ${
          location.pathname === "/admin"
            ? "bg-primary/10 text-primary font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </Link>
      
      {isSuperAdmin && (
        <Link
          to="/admin/ground-owners"
          className={`flex items-center px-3 py-2 text-sm rounded-md ${
            location.pathname === "/admin/ground-owners"
              ? "bg-primary/10 text-primary font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Users className="mr-2 h-4 w-4" />
          Ground Owners
        </Link>
      )}
      
      <Link
        to="/admin/grounds"
        className={`flex items-center px-3 py-2 text-sm rounded-md ${
          location.pathname === "/admin/grounds"
            ? "bg-primary/10 text-primary font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Map className="mr-2 h-4 w-4" />
        Grounds
      </Link>
      
      <Link
        to="/admin/bookings"
        className={`flex items-center px-3 py-2 text-sm rounded-md ${
          location.pathname === "/admin/bookings"
            ? "bg-primary/10 text-primary font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Bookings
      </Link>
      
      <Link
        to="/admin/inventory"
        className={`flex items-center px-3 py-2 text-sm rounded-md ${
          location.pathname === "/admin/inventory" || location.pathname === "/admin/inventory/allocate"
            ? "bg-primary/10 text-primary font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Package className="mr-2 h-4 w-4" />
        Inventory
      </Link>
      
      {isSuperAdmin && (
        <Link
          to="/admin/ecommerce"
          className={`flex items-center px-3 py-2 text-sm rounded-md ${
            location.pathname === "/admin/ecommerce"
              ? "bg-primary/10 text-primary font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          E-commerce
        </Link>
      )}
    </div>
  );

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-800">SportifyGround</span>
            </Link>
          </div>
          
          <ScrollArea className="flex-1 px-3">
            <NavItems />
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex items-center mb-2">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-medium text-gray-600">
                  {currentUser?.name.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role.replace('_', ' ')}</p>
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
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-800">SportifyGround</span>
          </Link>
          
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
                          {currentUser?.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{currentUser?.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 p-4">
                    <NavItems />
                  </ScrollArea>
                  
                  <div className="p-4 border-t mt-auto">
                    <div className="flex justify-between space-x-2">
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Breadcrumbs for mobile */}
        <div className="md:hidden bg-gray-50 px-4 py-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Link to="/admin" className="hover:text-primary">Admin</Link>
            {location.pathname !== "/admin" && (
              <>
                <ChevronRight className="h-3 w-3 mx-1" />
                <span className="font-medium text-gray-900">
                  {location.pathname.split("/").pop()?.replace("-", " ")}
                </span>
              </>
            )}
          </div>
        </div>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
