
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Camera } from "lucide-react";
import { getCurrentUserSync } from "@/utils/auth";

const ProfessionalCard = ({ professional, onLoginClick }: { professional: any; onLoginClick?: () => void }) => {
  const currentUser = getCurrentUserSync();
  const isAuthenticated = !!currentUser;

  const maskPhone = (phone: string) => {
    if (!phone || isAuthenticated) return phone;
    if (phone.length <= 4) return phone;
    return phone.substring(0, 2) + "*".repeat(phone.length - 4) + phone.substring(phone.length - 2);
  };

  // Extract years of experience from comments or use a default
  const getExperience = () => {
    if (professional.comments) {
      const match = professional.comments.match(/(\d+)\+?\s*years?/i);
      if (match) return `${match[1]}+ Years`;
    }
    const yearsActive = new Date().getFullYear() - new Date(professional.created_at).getFullYear();
    return `${yearsActive}+ Years`;
  };

  // Mock client count based on experience
  const getClientCount = () => {
    const experience = parseInt(getExperience()) || 1;
    const baseClients = Math.floor((experience * 50) + Math.random() * 200);
    return `${baseClients}+ Clients`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 bg-card border border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
              {professional.photo ? (
                <img
                  src={professional.photo}
                  alt={professional.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-foreground font-bold text-xl">
                  {professional.name?.charAt(0) || 'P'}
                </div>
              )}
            </div>
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {professional.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {professional.profession_type}
            </p>

            {/* Stats Row */}
            <div className="flex gap-4 mb-3">
              <div className="text-xs">
                <span className="font-medium text-foreground">{getExperience()}</span>
              </div>
              <div className="text-xs">
                <span className="font-medium text-foreground">{getClientCount()}</span>
              </div>
              <div className="text-xs">
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  Certified
                </Badge>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                🎯 Specialties
              </p>
              <p className="text-sm text-foreground">
                {professional.games?.name || "Sports Training"}, {professional.profession_type} +2 more
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mb-3">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-foreground">{professional.city}</span>
            </div>

            {/* Description */}
            {professional.comments && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {professional.comments}
              </p>
            )}

            {/* Contact Icons and Button */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isAuthenticated) onLoginClick?.();
                  }}
                  className="p-1 rounded hover:bg-muted transition-colors"
                  title="Phone"
                >
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="p-1 rounded hover:bg-muted transition-colors" title="Email">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="p-1 rounded hover:bg-muted transition-colors" title="Gallery">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <Link to={`/professional/${professional.id}`}>
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCard;
