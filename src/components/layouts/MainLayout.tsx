
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, Calendar, User, LogOut, ShoppingBag, ShoppingCart, MapPin, Users, Book, Store, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUserSync, logout, hasRoleSync } from "@/utils/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getCartItemsCount } from "@/utils/cart";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";

interface MainLayoutProps {
  children: React.ReactNode;
}

const LOGO_PATH = "/lovable-uploads/c9d204d2-6de6-4a97-855d-f2acf0bd0180.png";

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
            <img
              src={LOGO_PATH}
              alt="JOKOVA Logo"
              className="h-10 w-auto mr-2 rounded"
              style={{ background: "#fff" }}
            />
            <span className="text-2xl font-bold text-primary-800">JOKOVA</span>
          </Link>
          <div className="flex items-center gap-4">
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

      {/* Navigation Bar - Sticky and includes cart on the right */}
      <div className="sticky top-0 z-50 bg-primary text-white py-2 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="w-full flex justify-between">
              <div className="flex">
                <NavigationMenuItem>
                  <Link to="/search">
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 hover:text-white focus:bg-primary-700 focus:text-white focus:outline-none">
                      <Book className="mr-2 h-4 w-4" />
                      Book a Ground
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/grounds">
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 hover:text-white focus:bg-primary-700 focus:text-white focus:outline-none">
                      <MapPin className="mr-2 h-4 w-4" />
                      Grounds
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/sports-professionals">
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 hover:text-white focus:bg-primary-700 focus:text-white focus:outline-none">
                      <Users className="mr-2 h-4 w-4" />
                      Sports Professionals
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/events">
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 hover:text-white focus:bg-primary-700 focus:text-white focus:outline-none">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Events
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/shop">
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 hover:text-white focus:bg-primary-700 focus:text-white focus:outline-none">
                      <Store className="mr-2 h-4 w-4" />
                      Jokova's Store
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </div>
              
              {/* Cart in navigation bar */}
              <NavigationMenuItem>
                <Link to="/cart">
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 hover:text-white focus:bg-primary-700 focus:text-white focus:outline-none relative">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                    {cartItemsCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {cartItemsCount}
                      </Badge>
                    )}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

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
                &copy; {new Date().getFullYear()} JOKOVA. All rights reserved.
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
