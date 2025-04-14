
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, Calendar, User, LogOut, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUserSync, logout, hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getCartItemsCount } from "@/utils/cart";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUserSync();
  const cartItemsCount = getCartItemsCount();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-800">SportifyGround</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/shop" className="text-gray-700 hover:text-primary-600">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">Shop</span>
              </div>
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-primary-600 relative">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </div>
            </Link>
            {currentUser ? (
              <>
                <span className="text-sm text-gray-700">Hello, {currentUser.name}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
                {(currentUser.role === 'admin' || currentUser.role === 'super_admin') && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                    Dashboard
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top border-t border-gray-200">
        <div className="grid grid-cols-5 h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center ${
              location.pathname === "/" ? "text-primary-600" : "text-gray-500"
            }`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center justify-center ${
              location.pathname === "/search" ? "text-primary-600" : "text-gray-500"
            }`}
          >
            <Search size={20} />
            <span className="text-xs mt-1">Search</span>
          </Link>
          <Link
            to="/bookings"
            className={`flex flex-col items-center justify-center ${
              location.pathname === "/bookings" ? "text-primary-600" : "text-gray-500"
            }`}
          >
            <Calendar size={20} />
            <span className="text-xs mt-1">Bookings</span>
          </Link>
          <Link
            to="/shop"
            className={`flex flex-col items-center justify-center ${
              location.pathname === "/shop" ? "text-primary-600" : "text-gray-500"
            }`}
          >
            <ShoppingBag size={20} />
            <span className="text-xs mt-1">Shop</span>
          </Link>
          <Link
            to="/cart"
            className={`flex flex-col items-center justify-center relative ${
              location.pathname === "/cart" ? "text-primary-600" : "text-gray-500"
            }`}
          >
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
              >
                {cartItemsCount}
              </Badge>
            )}
            <span className="text-xs mt-1">Cart</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 md:py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} SportifyGround. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                About
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
