import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Filter, ChevronUp, ChevronDown } from "lucide-react";
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
  const isMobile = useIsMobile();

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

  const experienceRanges = [
    { value: ">1", label: "Less than 1 year" },
    { value: "1-2", label: "1-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "6-10", label: "6-10 years" },
    { value: "10+", label: "10+ years" },
  ];

  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [filterShow, setFilterShow] = useState<boolean>(
    isMobile ? false : true
  );

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  useEffect(() => {
    if (isMobile) {
      setFilterShow(false);
    } else {
      setFilterShow(true);
    }
  }, [isMobile]);
  return (
    <section className="w-full bg-secondary-50 bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
        <button
          className="text-secondary hover:text-accent-700 text-sm"
          onClick={clearAllFilters}
        >
          Reset All
        </button>
        <button
          className="text-secondary hover:text-accent-700 text-sm"
          hidden={!isMobile}
          onClick={() => setFilterShow(!filterShow)}
        >
          {filterShow ? <ChevronDown /> : <ChevronUp />}
        </button>
      </div>
      <div hidden={!filterShow} className="mt-4">
        {/* Certification Filter */}
        <div className="flex flex-row items-left">
          <label className="text-sm font-bold text-foreground mb-2 block text-left">
            Certified?
          </label>
          <div className="shrink items-left">
            <Switch
              checked={
                filters.isCertified === undefined
                  ? false
                  : filters.isCertified
                  ? true
                  : false
              }
              onCheckedChange={(value) =>
                handleFilterChange("isCertified", value)
              }
              className="ml-6"
            />
          </div>
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
            Experience
          </h4>
          {experienceRanges.map((experience) => (
            <label className="flex items-center">
              <RadioGroup
                onValueChange={(value) => {
                  setSelectedExperience(value);
                  handleFilterChange("experienceRange", value);
                }}
                value={selectedExperience}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <RadioGroupItem value={experience.value} id="gender" />
                  <label
                    htmlFor={experience.label}
                    className="text-sm font-medium ml-2 text-text-secondary"
                  >
                    {experience.label}
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
      </div>
    </section>
  );
};

export default VerticalFiltersSection;
