
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  User,
  Calendar,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, hasRole, logout } from "@/utils/auth";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isSuperAdmin = hasRole('super_admin');

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You do not have permission to access this area.</p>
          <Button onClick={() => navigate("/")}>Go to Homepage</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/admin" className="font-bold text-xl text-primary-800">
            Admin Dashboard
          </Link>
          <button
            className="md:hidden text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-sm">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.role === 'super_admin' ? 'Super Admin' : 'Ground Owner'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              to="/admin"
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                location.pathname === "/admin"
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home size={18} className="mr-3" />
              Dashboard
            </Link>

            {isSuperAdmin && (
              <Link
                to="/admin/ground-owners"
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  location.pathname === "/admin/ground-owners"
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Users size={18} className="mr-3" />
                Ground Owners
              </Link>
            )}

            <Link
              to="/admin/grounds"
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                location.pathname === "/admin/grounds"
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home size={18} className="mr-3" />
              Grounds
            </Link>

            <Link
              to="/admin/bookings"
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                location.pathname === "/admin/bookings"
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Calendar size={18} className="mr-3" />
              Bookings
            </Link>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between px-3 py-2 rounded-md text-sm w-full text-left text-gray-700 hover:bg-gray-100">
                <div className="flex items-center">
                  <Package size={18} className="mr-3" />
                  Inventory
                </div>
                <ChevronDown size={16} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Link
                  to="/admin/inventory"
                  className={`flex items-center pl-9 pr-3 py-2 rounded-md text-sm ${
                    location.pathname === "/admin/inventory"
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Current Inventory
                </Link>
                {isSuperAdmin && (
                  <Link
                    to="/admin/inventory/allocate"
                    className={`flex items-center pl-9 pr-3 py-2 rounded-md text-sm ${
                      location.pathname === "/admin/inventory/allocate"
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Allocate Inventory
                  </Link>
                )}
              </CollapsibleContent>
            </Collapsible>

            <Link
              to="/admin/settings"
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                location.pathname === "/admin/settings"
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings size={18} className="mr-3" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start text-gray-700"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        {/* Top navbar */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <button
              className="md:hidden text-gray-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div className="md:hidden font-semibold text-primary-800">
              Admin Dashboard
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700"
                onClick={() => navigate("/")}
              >
                View Website
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
