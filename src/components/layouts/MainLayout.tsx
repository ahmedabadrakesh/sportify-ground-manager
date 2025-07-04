import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, LogIn, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout, getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import jokovaLogoTextImage from "/public/green_text_only_logo.png";
import jokovaLogoSymbolImage from "/public/green_jokova_symbol.png";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const isSuperAdmin = hasRoleSync("super_admin");

  // Check authentication status on mount and listen for changes
  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUserSync();
      setAuthenticated(!!user);
    };

    // Check initial auth state
    checkAuth();

    // Listen for auth state changes
    const handleAuthStateChange = () => {
      checkAuth();
    };

    window.addEventListener("authStateChanged", handleAuthStateChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthStateChange);
    };
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 justify-between items-center">
            <div className="flex-grow items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={jokovaLogoSymbolImage}
                  width="80"
                  className="mr-2 fill-red-50"
                />
                <img src={jokovaLogoTextImage} width="180" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 mr-16">
              {/* <Link
                to="/search"
                className="text-green-700 font-bold hover:text-primary"
              >
                Grounds
              </Link> */}
              {/* <Link
                to="/bookings"
                className="text-green-700 font-bold  hover:text-primary"
              >
                Bookings
              </Link> */}
              <Link
                to="/sports-professionals"
                className="text-green-700 font-bold  hover:text-primary"
              >
                Sport Professionals
              </Link>
              <Link
                to="/events"
                className="text-green-700 font-bold  hover:text-primary"
              >
                Events
              </Link>
              <Link
                to="/shop"
                className="text-green-700 font-bold  hover:text-primary"
              >
                Shop
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-right space-x-1">
              <Link to="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              {authenticated ? (
                <div className="flex items-center space-x-1">
                  {isSuperAdmin && (
                    <Link to="/admin/dashboard">
                      <Button variant="outline">Dashboard</Button>
                    </Link>
                  )}
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Link to="/login">
                    <Button variant="ghost" className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="default" className="flex items-flex-end">
                      <UserPlus className="mr-2 h-4 w-4" /> Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-4 py-4">
              <Link
                to="/search"
                className="block py-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Grounds
              </Link>
              <Link
                to="/bookings"
                className="block py-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bookings
              </Link>
              <Link
                to="/sports-professionals"
                className="block py-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Professionals
              </Link>
              <Link
                to="/events"
                className="block py-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/shop"
                className="block py-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/api-documentation"
                className="block py-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                API Docs
              </Link>
              <Link
                to="/cart"
                className="block py-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart
              </Link>
              {authenticated ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="block py-2 hover:bg-gray-100 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 hover:bg-gray-100 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 hover:bg-gray-100 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 hover:bg-gray-100 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-100 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="text-xl font-bold text-primary">
                SportsArena
              </Link>
              <p className="mt-2 text-sm text-gray-600">
                Book sports grounds, equipment, and find professionals.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold uppercase text-gray-500">
                  Platform
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link
                      to="/search"
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      Find Grounds
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/bookings"
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/events"
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      Events
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase text-gray-500">
                  Support
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase text-gray-500">
                  Legal
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/api-documentation"
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      API Documentation
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <p className="text-sm text-gray-500">
              &copy; 2025 SportsArena. All rights reserved.
            </p>
            <div className="flex space-x-6 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-primary">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default MainLayout;
