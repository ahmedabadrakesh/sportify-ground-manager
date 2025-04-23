
import React from "react";
import { Ground } from "@/types/models";
import { Phone, MessageSquare, MapPin, Star, CupSoda, Toilet, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGames } from "@/hooks/useGames";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GroundInfoProps {
  ground: Ground;
}

const GroundInfo: React.FC<GroundInfoProps> = ({ ground }) => {
  const { games: allGames } = useGames();
  
  const gameNameMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    allGames.forEach((g) => {
      map[g.id] = g.name;
      map[g.name] = g.name;
    });
    return map;
  }, [allGames]);

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case "drinking water":
        return <Droplets className="h-5 w-5" />;
      case "toilet - ladies":
      case "toilet - gents":
        return <Toilet className="h-5 w-5" />;
      case "cafeteria":
        return <CupSoda className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">About This Ground</h2>
        <p className="text-gray-700 leading-relaxed">{ground.description}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Available Sports</h2>
        <div className="flex flex-wrap gap-2">
          {ground.games.map((game) => (
            <Badge key={game} variant="secondary" className="text-sm py-1">
              {gameNameMap[game] || game}
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Facilities & Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ground.facilities.map((facility) => (
            <TooltipProvider key={facility}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      {getFacilityIcon(facility) || <span className="text-primary-600 text-sm">✓</span>}
                    </div>
                    <span className="text-gray-700">{facility}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{facility}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Phone size={20} className="text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-gray-700">{ground.ownerContact}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MessageSquare size={20} className="text-gray-500 mt-1" />
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-gray-700">{ground.ownerWhatsapp}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin size={20} className="text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-gray-700">{ground.address}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GroundInfo;
