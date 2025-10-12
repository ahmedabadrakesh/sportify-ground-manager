import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Award, Volleyball, Target } from "lucide-react";
import { getCurrentUserSync } from "@/utils/auth";
import ContactDetailsPopup from "./ContactDetailsPopup";
import {
  addDotsForLongStrring,
  clientServedRounndoff,
  findNameById,
  toTitleCase,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CircularProgress from "./CircularProgress";

const ProfessionalListItem = ({
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
    <div className="p-4 hover:shadow-md transition-shadow bg-white border border-gray-200 rounded-lg">
      <Link
        to={`/professional/${professional.id}/${
          professional.name
            ? professional.name.toLowerCase().replace(/\s+/g, "-")
            : "unknown"
        }`}
      >
        <div className="flex items-start gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {professional.photo ? (
                <img
                  src={professional.photo}
                  alt={professional.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full uppercase h-full bg-gray-300 flex items-center justify-center text-secondary-900 font-bold text-2xl">
                  {professional.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "P"}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {/* Name and Profession */}
                <h3 className="flex items-center text-xl font-semibold text-gray-900 mb-1">
                  {professional.name}
                  {professional.is_certified && (
                    <div className="relative group ml-2">
                      <Award size={20} color="white" fill="#1f2ce0" />
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
                        Certified
                      </div>
                    </div>
                  )}
                </h3>
                <p className="flex items-center gap-2 mb-2 text-sm text-gray-600 font-medium">
                  {professional.profession_type.join(" • ")}
                </p>
                {professional.city && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{toTitleCase(professional.city.split(", ")[0])}</span>
                  </div>
                )}
              </div>

              {/* Right side stats */}
              <div className="flex flex-col items-end gap-2">
                <CircularProgress
                  professional={professional}
                  showPercentageOnly={true}
                />
                <Link
                  to={`/professional/${professional.id}/${
                    professional.name
                      ? professional.name.toLowerCase().replace(/\s+/g, "-")
                      : "unknown"
                  }`}
                >
                  <Button variant="secondary" size="sm" className="px-6">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats and Details */}
            <div className="space-y-3 mt-4">
              {/* Stats Badges */}
              <div className="flex items-center gap-2 flex-wrap">
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
                      {`${clientServedRounndoff(
                        professional.number_of_clients_served
                      )} Clients`}
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

              {/* Sports */}
              {professional.game_ids && professional.game_ids.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                    <Volleyball className="h-4 w-4 text-gray-500" />
                    Sports:
                  </div>
                  {professional.game_ids.slice(0, 4).map((gameId) => (
                    <Badge
                      key={gameId}
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700 border-0"
                    >
                      {findNameById(gameData, gameId)}
                    </Badge>
                  ))}
                  {professional.game_ids.length > 4 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700 border-0"
                    >
                      +{professional.game_ids.length - 4} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Specialties */}
              {professional.specialties &&
                professional.specialties.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                      <Target className="h-4 w-4 text-gray-500" />
                      Specialties:
                    </div>
                    {professional.specialties.slice(0, 4).map((specialty, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700 border-0"
                      >
                        {toTitleCase(specialty)}
                      </Badge>
                    ))}
                    {professional.specialties.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700 border-0"
                      >
                        +{professional.specialties.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}

              {/* Contact Actions */}
              <div className="flex gap-2 pt-2">
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
            </div>
          </div>
        </div>
      </Link>

      <ContactDetailsPopup
        open={contactPopupOpen}
        onOpenChange={setContactPopupOpen}
        professionalId={professional.id}
        professionalUserId={professional?.user_id || ""}
        professionalName={professional.name}
      />
    </div>
  );
};

export default ProfessionalListItem;
