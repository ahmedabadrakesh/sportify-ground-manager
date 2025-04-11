
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Ground } from "@/types/models";

interface GroundCardProps {
  ground: Ground;
}

const GroundCard: React.FC<GroundCardProps> = ({ ground }) => {
  return (
    <Link
      to={`/grounds/${ground.id}`}
      className="block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={ground.images[0] || "/placeholder.svg"}
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
          {ground.games.slice(0, 3).map((game) => (
            <Badge key={game} variant="secondary" className="font-normal">
              {game}
            </Badge>
          ))}
          {ground.games.length > 3 && (
            <Badge variant="outline" className="font-normal">
              +{ground.games.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {ground.facilities.includes("Drinking Water") && "Water • "}
            {ground.facilities.includes("Toilet - Ladies") && "Toilets • "}
            {ground.facilities.includes("Cafeteria") && "Cafeteria"}
          </div>
          <div className="text-sm font-medium text-primary-600">Book Now</div>
        </div>
      </div>
    </Link>
  );
};

export default GroundCard;
