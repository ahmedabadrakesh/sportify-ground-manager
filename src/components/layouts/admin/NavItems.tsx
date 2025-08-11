
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpenText,
  CalendarDays,
  CircleUser,
  Cog,
  LayoutGrid,
  Package,
  ShoppingBag,
  Users,
  Activity,
  CalendarDays as EventsIcon
} from "lucide-react";

interface NavItemsProps {
  isSuperAdmin: boolean;
}

const NavItems: React.FC<NavItemsProps> = ({ isSuperAdmin }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutGrid size={18} />,
      active: location.pathname === "/admin",
    },
    {
      name: "Grounds",
      href: "/admin/grounds",
      icon: <Package size={18} />,
      active: isActive("/admin/grounds"),
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: <CalendarDays size={18} />,
      active: isActive("/admin/bookings"),
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: <EventsIcon size={18} />,
      active: isActive("/admin/events"),
    },
    {
      name: "Inventory",
      href: "/admin/inventory",
      icon: <BookOpenText size={18} />,
      active: isActive("/admin/inventory"),
    },
    {
      name: "Sports Professionals",
      href: "/admin/sports-professionals",
      icon: <Activity size={18} />,
      active: isActive("/admin/sports-professionals"),
    },
    {
      name: "E-commerce",
      href: "/admin/ecommerce",
      icon: <ShoppingBag size={18} />,
      active: isActive("/admin/ecommerce"),
    },
    {
      name: "Direct Sell",
      href: "/admin/direct-sell",
      icon: <CircleUser size={18} />,
      active: isActive("/admin/direct-sell"),
    },
  ];

  if (isSuperAdmin) {
    navItems.splice(1, 0, {
      name: "Ground Owners",
      href: "/admin/ground-owners",
      icon: <Users size={18} />,
      active: isActive("/admin/ground-owners"),
    });
  }

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`${
            item.active
              ? "bg-gray-100 text-primary"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
        >
          <span
            className={`${
              item.active ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
            } mr-3`}
          >
            {item.icon}
          </span>
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
