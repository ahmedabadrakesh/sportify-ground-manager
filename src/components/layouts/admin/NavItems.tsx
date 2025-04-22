import React from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Users, Map, Calendar, Package, ShoppingBag 
} from "lucide-react";
import { useLocation } from "react-router-dom";

interface NavItemsProps {
  isSuperAdmin: boolean;
}

const NavItems: React.FC<NavItemsProps> = ({ isSuperAdmin }) => {
  const location = useLocation();

  return (
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
        <>
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

          <Link
            to="/admin/sports-professionals"
            className={`flex items-center px-3 py-2 text-sm rounded-md ${
              location.pathname === "/admin/sports-professionals"
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users className="mr-2 h-4 w-4" />
            Sports Professionals
          </Link>
        </>
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
};

export default NavItems;
