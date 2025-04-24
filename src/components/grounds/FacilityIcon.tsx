
import React from "react";
import {
  CupSoda,
  Car,
  Toilet,
  Shirt,
  CreditCard,
  Armchair,
  LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const facilityIcons: Record<string, LucideIcon> = {
  utensils: CupSoda,
  "circle-parking": Car,
  toilet: Toilet,
  shirt: Shirt,
  "credit-card": CreditCard,
  chair: Armchair,
};

interface FacilityIconProps {
  icon: string;
  name: string;
  className?: string;
}

const FacilityIcon: React.FC<FacilityIconProps> = ({ icon, name, className = "" }) => {
  const Icon = facilityIcons[icon] || CupSoda;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Icon className={`h-4 w-4 ${className}`} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FacilityIcon;
