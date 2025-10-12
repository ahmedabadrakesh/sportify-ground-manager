import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Calendar, ShoppingBag, LogIn } from "lucide-react";
import { getCurrentUserSync } from "@/utils/auth";
import CartIcon from "@/components/cart/CartIcon";

const MobileBottomNav = () => {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setAuthenticated(!!getCurrentUserSync());
    };

    checkAuth();

    // Listen for authentication changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const navItems = [
    {
      name: "Professionals",
      href: "/sports-professionals",
      icon: User,
    },
    {
      name: "News",
      href: "/sports-news",
      icon: Calendar,
    },
    // {
    //   name: "Events",
    //   href: "/events",
    //   icon: Calendar,
    // },
    {
      name: "Shop",
      href: "/shop",
      icon: ShoppingBag,
    },
    {
      name: "Cart",
      href: "/cart",
      icon: () => <CartIcon />,
    },
    {
      name: authenticated ? "Profile" : "Login",
      href: authenticated ? "/admin/dashboard" : "/login",
      icon: LogIn,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              {item.name === "Cart" ? (
                <CartIcon className="h-5 w-5 mb-1" />
              ) : (
                <Icon className="h-5 w-5 mb-1" />
              )}
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
