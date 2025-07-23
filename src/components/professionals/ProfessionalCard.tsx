
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Calendar } from "lucide-react";
import { getCurrentUserSync } from "@/utils/auth";

const ProfessionalCard = ({ professional, onLoginClick }: { professional: any; onLoginClick?: () => void }) => {
  const currentUser = getCurrentUserSync();
  const isAuthenticated = !!currentUser;

  const maskPhone = (phone: string) => {
    if (!phone || isAuthenticated) return phone;
    if (phone.length <= 4) return phone;
    return phone.substring(0, 2) + "*".repeat(phone.length - 4) + phone.substring(phone.length - 2);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <Link to={`/professional/${professional.id}`}>
        <div className="relative h-48">
          <img
            src={professional.photo || "/placeholder.svg"}
            alt={professional.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-gray-900">{professional.profession_type}</Badge>
          </div>
        </div>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {professional.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Badge variant="outline" className="text-xs">{professional.games?.name}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">₹{professional.fee}</div>
              <div className="text-xs text-gray-500">{professional.fee_type}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{professional.city}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{maskPhone(professional.contact_number)}</span>
              {!isAuthenticated && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLoginClick?.();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer ml-1"
                >
                  (Login to view)
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Member since {new Date(professional.created_at).getFullYear()}</span>
            </div>
            {professional.comments && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                {professional.comments}
              </p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={(e) => e.preventDefault()}
            >
              View This Profile
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProfessionalCard;
