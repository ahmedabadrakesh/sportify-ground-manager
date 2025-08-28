import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProfessionalCard from "./ProfessionalCard";
import AuthRequiredDialog from "@/components/auth/AuthRequiredDialog";
import ProfessionalsFilters from "./ProfessionalsFilters";
import { useGames } from "@/hooks/useGames";

interface FilterOptions {
  city?: string;
  gameId?: string;
  isCertified?: boolean;
  experienceRange?: string;
  sex?: string;
}

interface ProfessionalsListProps {
  sportFilter?: string | null;
}

const ProfessionalsList = ({ sportFilter }: ProfessionalsListProps) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const { games } = useGames();

  const {
    data: allProfessionals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sports-professionals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sports_professionals")
        .select(
          `
          id, profession_type, name, fee, fee_type, address, city, comments,
          photo, user_id, created_at, updated_at, awards, accomplishments,
          certifications, training_locations, videos, images, punch_line,
          instagram_link, facebook_link, linkedin_link, website, level,
          coaching_availability, youtube_link, years_of_experience,
          total_match_played, academy_name, whatsapp, whatsapp_same_as_phone,
          district_level_tournaments, state_level_tournaments,
          national_level_tournaments, international_level_tournaments,
          specialties, education, one_on_one_price, group_session_price,
          online_price, free_demo_call, about_me, success_stories,
          training_locations_detailed, is_certified, game_ids, deleted_at,sex
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });

  // Get unique cities for filter dropdown
  const availableCities = useMemo(() => {
    if (!allProfessionals) return [];
    const cities = allProfessionals
      .map((prof) => prof.city)
      .filter((city) => city)
      .filter((city, index, arr) => arr.indexOf(city) === index)
      .sort();
    return cities;
  }, [allProfessionals]);

  // Apply filters to professionals
  const professionals = useMemo(() => {
    if (!allProfessionals) return [];

    return allProfessionals.filter((prof) => {
      // City filter
      if (filters.city && prof.city !== filters.city) {
        return false;
      }

      // sex filter
      if (filters.sex && prof.sex !== filters.sex) {
        return false;
      }

      // Game filter
      if (
        filters.gameId &&
        (!prof.game_ids || !prof.game_ids.includes(filters.gameId))
      ) {
        return false;
      }

      // Sport filter from props (URL parameter)
      if (sportFilter && games) {
        const sportGame = games.find(
          (game) => game.name.toLowerCase() === sportFilter.toLowerCase()
        );
        if (sportGame) {
          // If professional has no game_ids or empty array, exclude them
          if (!prof.game_ids || prof.game_ids.length === 0) {
            return false;
          }
          // Check if professional's games include the filtered sport
          if (!prof.game_ids.includes(sportGame.id)) {
            return false;
          }
        }
      }

      // Certification filter
      if (
        filters.isCertified !== undefined &&
        prof.is_certified !== filters.isCertified
      ) {
        return false;
      } else if (
        filters.isCertified !== undefined &&
        prof.is_certified === filters.isCertified
      ) {
        return true;
      }

      // Experience filter
      if (filters.experienceRange && prof.years_of_experience !== null) {
        const experience = prof.years_of_experience;
        switch (filters.experienceRange) {
          case "0-2":
            if (experience > 2) return false;
            break;
          case "3-5":
            if (experience < 3 || experience > 5) return false;
            break;
          case "6-10":
            if (experience < 6 || experience > 10) return false;
            break;
          case "10+":
            if (experience < 10) return false;
            break;
        }
      }

      return true;
    });
  }, [allProfessionals, filters, sportFilter]);

  console.log(
    "ProfessionalsList render - isLoading:",
    isLoading,
    "error:",
    error,
    "professionals:",
    professionals
  );

  const handleLoginClick = () => {
    setIsAuthDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-80 bg-gray-100 animate-pulse rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          Error loading sports professionals: {error.message}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Check console for more details
        </p>
      </div>
    );
  }

  if (!professionals || professionals.length === 0) {
    const noDataMessage = sportFilter
      ? `No ${sportFilter} professionals found. Be the first to register!`
      : "No sports professionals found. Be the first to register!";

    return (
      <div className="container text-center max-w-7xl">
        <ProfessionalsFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableCities={availableCities}
        />
        <p className="text-gray-600">{noDataMessage}</p>
        <p className="text-sm text-gray-500 mt-2">
          If you expect to see data here, there might be a permissions issue.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <ProfessionalsFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableCities={availableCities}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals?.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              onLoginClick={handleLoginClick}
            />
          ))}
        </div>
      </div>

      <AuthRequiredDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        title="Login Required"
        description="Please login or register to view complete contact details."
      />
    </>
  );
};

export default ProfessionalsList;
