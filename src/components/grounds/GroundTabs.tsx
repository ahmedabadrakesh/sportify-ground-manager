
import React from "react";
import { Phone, MessageSquare, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Ground } from "@/types/models";

interface GroundTabsProps {
  ground: Ground;
}

const GroundTabs: React.FC<GroundTabsProps> = ({ ground }) => {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="facilities">Facilities</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed">{ground.description}</p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-3">Available Sports</h2>
          <div className="flex flex-wrap gap-2">
            {ground.games.map((game) => (
              <Badge key={game} variant="secondary" className="text-sm py-1">
                {game}
              </Badge>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="facilities" className="space-y-6">
        <h2 className="text-xl font-semibold mb-3">Facilities & Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ground.facilities.map((facility) => (
            <div key={facility} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">{facility}</span>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="contact" className="space-y-6">
        <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
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
      </TabsContent>
    </Tabs>
  );
};

export default GroundTabs;
