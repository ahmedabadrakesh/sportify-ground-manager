
import React from "react";
import { MapPin, Star } from "lucide-react";
import { Ground } from "@/types/models";

interface GroundHeaderProps {
  ground: Ground;
}

const GroundHeader: React.FC<GroundHeaderProps> = ({ ground }) => {
  // Get the correct image path for display
  const imagePath = ground.images[0] || "/placeholder.svg";
  // Remove the "public/" prefix if it exists (for correct browser display)
  const displayImagePath = imagePath.startsWith("public/") ? imagePath.substring(7) : imagePath;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="aspect-[3/1] overflow-hidden relative">
        <img
          src={displayImagePath}
          alt={ground.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{ground.name}</h1>
          <div className="flex items-center text-sm">
            <MapPin size={16} className="mr-1" />
            <span>{ground.address}</span>
            {ground.rating && (
              <div className="ml-4 flex items-center">
                <Star size={16} className="text-yellow-400 mr-1" />
                <span>
                  {ground.rating.toFixed(1)} ({ground.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroundHeader;
