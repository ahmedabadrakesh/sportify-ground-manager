
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface MobileBreadcrumbProps {
  pathname: string;
}

const MobileBreadcrumb: React.FC<MobileBreadcrumbProps> = ({ pathname }) => {
  return (
    <div className="md:hidden bg-gray-50 px-4 py-2 text-sm">
      <div className="flex items-center text-gray-600">
        <Link to="/admin" className="hover:text-primary">Admin</Link>
        {pathname !== "/admin" && (
          <>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="font-medium text-gray-900">
              {pathname.split("/").pop()?.replace("-", " ")}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileBreadcrumb;
