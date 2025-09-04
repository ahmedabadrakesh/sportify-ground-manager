import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Camera,
  Target,
  BadgeCheck,
  Volleyball,
  Award,
  CheckCircle,
} from "lucide-react";
import { getCurrentUserSync } from "@/utils/auth";
import ContactDetailsPopup from "./ContactDetailsPopup";
import { findNameById } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: gameData } = useQuery({
    queryKey: ["id"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const handleContactClick = (type: "phone" | "email") => {
    if (!isAuthenticated) {
      onLoginClick?.();
      return;
    }
    setContactPopupOpen(true);
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow bg-white border border-gray-200">
      <Link
        to={`/professional/${
          professional.name
            ? professional.name.toLowerCase().replace(/\s+/g, "-")
            : "unknown"
        }/${professional.id}`}
      >
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
                <div className="w-full uppercase h-full bg-gray-300 flex items-center justify-center text-secondary-900 font-bold text-lg">
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
                  <div className="relative group">
                    <Award
                      size={20}
                      color="white"
                      className="ml-2"
                      fill="#1f2ce0"
                      type="button"
                    />
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                      {"Certified"}
                    </div>
                  </div>
                )}
              </>
            </h3>
            <p className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              {professional.profession_type.join(" • ")}
              {/* Location */}
              {professional.city && (
                <>
                  <MapPin className="h-4 w-4 text-xs text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {professional.city}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="md:h-40">
          {/* Stats Row */}
          <div className="flex items-center gap-2">
            {professional.years_of_experience !== null &&
              professional.years_of_experience !== 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700 border-0"
                >
                  {`${professional.years_of_experience} Years`}
                </Badge>
              )}
            {professional.number_of_clients_served !== null &&
              professional.number_of_clients_served !== 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700 border-0"
                >
                  {`${professional.number_of_clients_served} Clients Served`}
                </Badge>
              )}
            {professional.is_certified && (
              <Badge
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-700 border-0"
              >
                Certified
              </Badge>
            )}
          </div>

          {professional.game_ids && (
            <div className="mb-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Volleyball className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-700">
                  Sports
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2 mt-2">
                {professional.game_ids.map((gameId) => {
                  return (
                    <Badge
                      variant="secondary"
                      className="text-xs   bg-gray-100 text-gray-700 border-0"
                    >
                      {findNameById(gameData, gameId)}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specialties */}
          <div className="mb-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">
                Specialties
              </span>
            </div>

            {/* <p className="text-xs text-left text-gray-600">
              {professional.game_ids && professional.game_ids.length > 0
                ? "Multi-Sport Training"
                : "Sports Training"}
              , {professional.profession_type} +2 more
            </p> */}
            <div className="text-xs text-left text-gray-600 gap-4">
              {professional.specialties.map((specialty, index) => (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700 border-0 mt-2"
                >
                  <span className="text-sm">{specialty}</span>
                </Badge>
              ))}
            </div>
          </div>
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
              variant="secondary"
              size="sm"
              className=" px-4 py-2 text-sm"
            >
              View Profile
            </Button>
          </Link>
        </div>
      </Link>

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
