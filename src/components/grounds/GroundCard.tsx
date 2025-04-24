import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, CupSoda, Toilet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Ground } from "@/types/models";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FacilityIcon from "./FacilityIcon";
import { useFacilities } from "@/hooks/useFacilities";

interface GroundCardProps {
  ground: Ground & { games?: string[] };
}

const GroundCard: React.FC<GroundCardProps> = ({ ground }) => {
  const { data: facilities = [] } = useFacilities();
  // Get the correct image path for display
  const imagePath = ground.images[0] || "/placeholder.svg";
  // Remove the "public/" prefix if it exists (for correct browser display)
  const displayImagePath = imagePath.startsWith("public/") ? imagePath.substring(7) : imagePath;

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case "drinking water":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 2a1 1 0 0 0-1 1v19a1 1 0 1 0 2 0v-6a2 2 0 1 1 4 0v6a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1H6z" />
                  </svg>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Drinking Water</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "toilet":
      case "toilet - ladies":
      case "toilet - gents":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center mr-2">
                  <Toilet className="h-3.5 w-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toilet</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "cafeteria":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center mr-2">
                  <CupSoda className="h-3.5 w-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cafeteria</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  const renderFacility = (facility: string) => {
    const icon = getFacilityIcon(facility);
    if (!icon) return null;
    return icon;
  };

  const renderFacilities = () => {
    if (!ground.facilities) return null;
    
    return ground.facilities.map(facilityId => {
      const facility = facilities.find(f => f.id === facilityId);
      if (!facility) return null;
      
      return (
        <FacilityIcon
          key={facility.id}
          icon={facility.icon}
          name={facility.name}
          className="text-gray-600"
        />
      );
    });
  };

  return (
    <Link
      to={`/grounds/${ground.id}`}
      className="block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={displayImagePath}
          alt={ground.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {ground.rating && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full flex items-center px-2 py-1 text-sm">
            <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
            <span className="font-medium">{ground.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 truncate">
          {ground.name}
        </h3>

        <div className="flex items-center mt-1 text-gray-500 text-sm">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{ground.address}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {(ground.games || []).slice(0, 3).map((game) => (
            <Badge key={game} variant="secondary" className="font-normal">
              {game}
            </Badge>
          ))}
          {(ground.games && ground.games.length > 3) && (
            <Badge variant="outline" className="font-normal">
              +{ground.games.length - 3} more
            </Badge>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {renderFacilities()}
          </div>
          <div className="text-sm font-medium text-primary-600">Book Now</div>
        </div>
      </div>
    </Link>
  );
};

export default GroundCard;
