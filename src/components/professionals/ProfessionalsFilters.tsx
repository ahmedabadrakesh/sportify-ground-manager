import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Filter, ChevronUp } from "lucide-react";
import { useGames } from "@/hooks/useGames";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterOptions {
  city?: string;
  gameId?: string;
  isCertified?: boolean;
  experienceRange?: string;
  sex?: string;
}

interface ProfessionalsFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCities: string[];
}

const ProfessionalsFilters = ({
  filters,
  onFiltersChange,
  availableCities,
}: ProfessionalsFiltersProps) => {
  const { games } = useGames();
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(false);

  const genderValues = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const experienceRanges = [
    { value: "0-2", label: "0-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "6-10", label: "6-10 years" },
    { value: "10+", label: "10+ years" },
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined
  );

  // On mobile, show filters based on showFilters state
  const shouldShowFilters = !isMobile || showFilters;

  return (
    <div className="mb-6">
      {/* Mobile Filter Toggle Button */}
      {isMobile && (
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full mb-4 flex items-center justify-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
          {showFilters && <ChevronUp className="h-4 w-4" />}
        </Button>
      )}

      {/* Filters Container */}
      {shouldShowFilters && (
        <div className="bg-card border rounded-lg p-6">
          {/* Close button for mobile when filters are shown */}
          {isMobile && (
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4">
            {/* City Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                City
              </label>
              <Select
                value={filters.city || "all"}
                onValueChange={(value) => handleFilterChange("city", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gender Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Gender
              </label>
              <Select
                value={filters.sex || "all"}
                onValueChange={(value) => handleFilterChange("sex", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {genderValues.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Game Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Sport
              </label>
              <Select
                value={filters.gameId || "all"}
                onValueChange={(value) => handleFilterChange("gameId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {games?.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Certification Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Certification
              </label>
              <Select
                value={
                  filters.isCertified === undefined
                    ? "all"
                    : filters.isCertified
                    ? "certified"
                    : "not-certified"
                }
                onValueChange={(value) =>
                  handleFilterChange(
                    "isCertified",
                    value === "all"
                      ? undefined
                      : value === "certified"
                      ? true
                      : false
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="certified">Certified</SelectItem>
                  <SelectItem value="not-certified">Not Certified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Experience
              </label>
              <Select
                value={filters.experienceRange || "all"}
                onValueChange={(value) =>
                  handleFilterChange("experienceRange", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  {experienceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters and Clear Button */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>

              {filters.city && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  City: {filters.city}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("city", undefined)}
                  />
                </Badge>
              )}

              {filters.gameId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sport: {games?.find((g) => g.id === filters.gameId)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("gameId", undefined)}
                  />
                </Badge>
              )}

              {filters.isCertified !== undefined && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.isCertified ? "Certified" : "Not Certified"}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("isCertified", undefined)}
                  />
                </Badge>
              )}

              {filters.experienceRange && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Experience:{" "}
                  {
                    experienceRanges.find(
                      (r) => r.value === filters.experienceRange
                    )?.label
                  }
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      handleFilterChange("experienceRange", undefined)
                    }
                  />
                </Badge>
              )}

              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfessionalsFilters;
