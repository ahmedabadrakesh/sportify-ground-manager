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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelect } from "@/components/ui/multi-select";
import { Gamepad2, CheckIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const VerticalFiltersSection = ({
  filters,
  onFiltersChange,
  availableCities,
}: ProfessionalsFiltersProps) => {
  const { games } = useGames();
  const gameOptions =
    games?.map((game) => ({
      label: game.name,
      value: game.name,
      icon: Gamepad2,
    })) || [];

  const genderValues = [
    { value: "all", label: "All" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const [selectedGender, setSelectedGender] = useState<string>("all");

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  return (
    <section className="py-8 bg-secondary-50 bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
        <button
          className="text-accent hover:text-accent-700 text-sm"
          onClick={clearAllFilters}
        >
          Reset All
        </button>
      </div>
      {/* Games */}
      <div className="mb-6">
        <h4 className="text-text-primary mb-3 font-bold text-left">Games</h4>
        <div className="space-y-2">
          <ScrollArea className="h-[calc(30vh)] px-1">
            {games.map((option) => {
              return (
                <label
                  className="flex items-top text-left"
                  onClick={(value) => {
                    handleFilterChange("gameId", option.id);
                  }}
                >
                  <input
                    type="checkbox"
                    className="rounded border-secondary-300 text-accent focus:ring-accent/20"
                  />
                  <span className="ml-2 text-text-secondary">
                    {option.name}
                  </span>
                </label>
              );
            })}
          </ScrollArea>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-text-primary mb-3 font-bold text-left">Gender</h4>
        {genderValues.map((gender) => (
          <label className="flex items-center">
            {/* <input
                type="checkbox"
                className="rounded border-secondary-300 text-accent focus:ring-accent/20"
                onClick={() =>
                  handleFilterChange("sex", checked ? gender.label : "All")
                }
              /> */}
            <RadioGroup
              onValueChange={(value) => {
                setSelectedGender(value);
                handleFilterChange("sex", value);
              }}
              value={selectedGender}
              className="flex flex-row space-x-4"
            >
              <div className="flex items-center space-x-2 mb-1">
                <RadioGroupItem value={gender.value} id="gender" />
                <label
                  htmlFor={gender.label}
                  className="text-sm font-medium ml-2 text-text-secondary"
                >
                  {gender.label}
                </label>
              </div>
            </RadioGroup>

            {/* <Checkbox
                id={`facility-${`gender_${gender.label}`}`}
                checked={selectedFacilities.includes(facility)}
                onCheckedChange={() =>
                  handleFilterChange("sex", checked ? gender.label : "All")
                }
              /> */}
          </label>
        ))}
      </div>
      <div className="mb-6">
        <h4 className="text-text-primary mb-3 font-bold text-left">
          Price Range
        </h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">$25 - $50/hour</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">$50 - $100/hour</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">$100 - $200/hour</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">$200+/hour</span>
          </label>
        </div>
      </div>
      {/* <!-- Experience Level --> */}
      <div className="mb-6">
        <h4 className="text-text-primary mb-3 font-bold text-left">
          Experience Level
        </h4>
        <div className="space-y-2 text-left">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">
              Beginner (0-2 years)
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">
              Intermediate (3-5 years)
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">
              Advanced (6-10 years)
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">Expert (10+ years)</span>
          </label>
        </div>
      </div>
      {/* <!-- Availability --> */}
      <div className="mb-6">
        <h4 className="text-text-primary mb-3 font-bold text-left">
          Availability
        </h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">Available Today</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">This Week</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">Flexible Schedule</span>
          </label>
        </div>
      </div>
      {/* <!-- Session Type --> */}
      <div className="mb-6">
        <h4 className="text-text-primary mb-3 font-bold text-left">
          Session Type
        </h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">In-Person</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">Online</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-secondary-300 text-accent focus:ring-accent/20"
            />
            <span className="ml-2 text-text-secondary">Group Sessions</span>
          </label>
        </div>
      </div>
    </section>
  );
};

export default VerticalFiltersSection;
