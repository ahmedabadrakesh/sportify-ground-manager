import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Camera, Target, BadgeCheck } from "lucide-react";
import { getCurrentUserSync } from "@/utils/auth";
import ContactDetailsPopup from "./ContactDetailsPopup";

const ProfessionalCard = ({
  professional,
  onLoginClick,
}: {
  professional: any;
  onLoginClick?: () => void;
}) => {
  const currentUser = getCurrentUserSync();
  const isAuthenticated = !!currentUser;
  const [contactPopupOpen, setContactPopupOpen] = useState(false);

  // Extract years of experience from comments or use a default
  const getExperience = () => {
    if (professional.comments) {
      const match = professional.comments.match(/(\d+)\+?\s*years?/i);
      if (match) return `${match[1]}+ Years`;
    }
    const yearsActive =
      new Date().getFullYear() -
      new Date(professional.created_at).getFullYear();
    return `${Math.max(yearsActive, 1)}+ Years`;
  };

  // Mock client count based on experience
  const getClientCount = () => {
    const experience = parseInt(getExperience()) || 1;
    const baseClients = Math.floor(experience * 50 + Math.random() * 200);
    return `${baseClients}+ Clients`;
  };

  const handleContactClick = (type: "phone" | "email") => {
    if (!isAuthenticated) {
      onLoginClick?.();
      return;
    }
    setContactPopupOpen(true);
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow bg-white border border-gray-200">
      <div className="flex items-start gap-4 mb-2">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {professional.photo ? (
              <img
                src={professional.photo}
                alt={professional.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm">
                {professional.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "P"}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 text-left">
          {/* Name and Profession */}
          <h3 className="flex flex-row text-lg font-semibold text-gray-900 mb-1">
            <>
              {professional.name}
              {professional.is_certified && (
                <BadgeCheck
                  size={20}
                  color="white"
                  className="ml-2"
                  fill="#1f2ce0"
                  type="button"
                />
              )}
            </>
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {professional.profession_type}
          </p>
        </div>
      </div>

      <div className="md:h-40">
        {/* Stats Row */}
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-xs bg-gray-100 text-gray-700 border-0"
          >
            {getExperience()}
          </Badge>
          <Badge
            variant="secondary"
            className="text-xs bg-gray-100 text-gray-700 border-0"
          >
            {getClientCount()}
          </Badge>
          {professional.is_certified && (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-700 border-0"
            >
              Certified
            </Badge>
          )}
        </div>

        {/* Specialties */}
        <div className="mb-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700">
              Specialties
            </span>
          </div>
          <p className="text-xs text-left text-gray-600">
            {professional.game_ids && professional.game_ids.length > 0
              ? "Multi-Sport Training"
              : "Sports Training"}
            , {professional.profession_type} +2 more
          </p>
        </div>

        {/* Location */}
        {professional.city && (
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-xs text-gray-500" />
            <span className="text-sm text-gray-600">{professional.city}</span>
          </div>
        )}
        {/* Description */}
        {professional.comments && (
          <p className="text-sm text-gray-600 mb-2 text-left line-clamp-2">
            {professional.comments}
          </p>
        )}
      </div>
      {/* Bottom Row - Contact Icons and Button */}
      <hr className="m-2" />
      <div className="flex items-center justify-between align-bottom">
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleContactClick("phone");
            }}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title={isAuthenticated ? "View Phone" : "Login to view phone"}
          >
            📞
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleContactClick("email");
            }}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title={isAuthenticated ? "View Email" : "Login to view email"}
          >
            ✉️
          </button>
          <button
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Gallery"
          >
            📷
          </button>
        </div>

        <Link
          to={`/professional/${
            professional.name
              ? professional.name.toLowerCase().replace(/\s+/g, "-")
              : "unknown"
          }/${professional.id}`}
        >
          <Button
            variant="default"
            size="sm"
            className="bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 text-sm"
          >
            View Profile
          </Button>
        </Link>
      </div>

      <ContactDetailsPopup
        open={contactPopupOpen}
        onOpenChange={setContactPopupOpen}
        professionalId={professional.id}
        professionalName={professional.name}
      />
    </Card>
  );
};

export default ProfessionalCard;
