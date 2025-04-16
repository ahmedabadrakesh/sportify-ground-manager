
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroundsHeaderProps {
  isSuperAdmin: boolean;
}

const GroundsHeader: React.FC<GroundsHeaderProps> = ({ isSuperAdmin }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grounds</h1>
        <p className="text-gray-600">
          {isSuperAdmin
            ? "Manage all sports grounds across the platform"
            : "Manage your sports grounds"}
        </p>
      </div>
      
      <Button
        className="flex items-center"
        onClick={() => navigate("/admin/grounds/add")}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add New Ground
      </Button>
    </div>
  );
};

export default GroundsHeader;
