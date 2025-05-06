
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface MobileBreadcrumbProps {
  pathname: string;
}

const MobileBreadcrumb: React.FC<MobileBreadcrumbProps> = ({ pathname }) => {
  // Determine the title and path parts based on the current URL
  let title = "Dashboard";
  let pathParts: { label: string; href: string }[] = [];

  if (pathname.startsWith("/admin/grounds")) {
    if (pathname === "/admin/grounds/add") {
      title = "Add Ground";
      pathParts = [
        { label: "Admin", href: "/admin" },
        { label: "Grounds", href: "/admin/grounds" },
        { label: "Add", href: "/admin/grounds/add" },
      ];
    } else {
      title = "Grounds";
      pathParts = [
        { label: "Admin", href: "/admin" },
        { label: "Grounds", href: "/admin/grounds" },
      ];
    }
  } else if (pathname.startsWith("/admin/ground-owners")) {
    title = "Ground Owners";
    pathParts = [
      { label: "Admin", href: "/admin" },
      { label: "Ground Owners", href: "/admin/ground-owners" },
    ];
  } else if (pathname.startsWith("/admin/bookings")) {
    title = "Bookings";
    pathParts = [
      { label: "Admin", href: "/admin" },
      { label: "Bookings", href: "/admin/bookings" },
    ];
  } else if (pathname.startsWith("/admin/inventory")) {
    if (pathname === "/admin/inventory/allocate") {
      title = "Allocate Inventory";
      pathParts = [
        { label: "Admin", href: "/admin" },
        { label: "Inventory", href: "/admin/inventory" },
        { label: "Allocate", href: "/admin/inventory/allocate" },
      ];
    } else {
      title = "Inventory";
      pathParts = [
        { label: "Admin", href: "/admin" },
        { label: "Inventory", href: "/admin/inventory" },
      ];
    }
  } else if (pathname.startsWith("/admin/ecommerce")) {
    title = "E-commerce";
    pathParts = [
      { label: "Admin", href: "/admin" },
      { label: "E-commerce", href: "/admin/ecommerce" },
    ];
  } else if (pathname.startsWith("/admin/sports-professionals")) {
    title = "Sports Professionals";
    pathParts = [
      { label: "Admin", href: "/admin" },
      { label: "Sports Professionals", href: "/admin/sports-professionals" },
    ];
  } else if (pathname.startsWith("/admin/events")) {
    title = "Events";
    pathParts = [
      { label: "Admin", href: "/admin" },
      { label: "Events", href: "/admin/events" },
    ];
  } else {
    pathParts = [{ label: "Admin", href: "/admin" }];
  }

  return (
    <div className="md:hidden bg-white border-b px-4 py-3">
      <div className="flex items-center text-sm">
        {pathParts.map((part, index) => (
          <React.Fragment key={part.href}>
            {index > 0 && (
              <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />
            )}
            <Link
              to={part.href}
              className={
                index === pathParts.length - 1
                  ? "font-medium text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }
            >
              {part.label}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MobileBreadcrumb;
