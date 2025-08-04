
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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 group cursor-pointer border-0 bg-card/50 backdrop-blur-sm">
      <Link to={`/professional/${professional.id}`}>
        <div className="relative h-56 overflow-hidden">
          <img
            src={professional.photo || "/placeholder.svg"}
            alt={professional.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/95 text-gray-900 shadow-lg backdrop-blur-sm border-0">
              {professional.profession_type}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">
              {professional.name}
            </h3>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {professional.games?.name}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="text-2xl font-bold text-primary mb-1">
                ₹{professional.fee}
              </div>
              <div className="text-sm text-muted-foreground">
                per {professional.fee_type}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Available</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{professional.city}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{maskPhone(professional.contact_number)}</span>
              {!isAuthenticated && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLoginClick?.();
                  }}
                  className="text-xs text-accent hover:text-accent/80 underline cursor-pointer ml-1 font-medium"
                >
                  (Login to view)
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">
                Since {new Date(professional.created_at).getFullYear()}
              </span>
            </div>
            
            {professional.comments && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground line-clamp-2 italic">
                  "{professional.comments}"
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg" 
              onClick={(e) => e.preventDefault()}
            >
              View Profile
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="shrink-0 hover:bg-primary hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProfessionalCard;
