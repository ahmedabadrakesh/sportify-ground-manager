import React, { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCityAutocomplete } from "@/hooks/useCityAutocomplete";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Select city...",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value || "");
  const { cities, isLoading, searchCities } = useCityAutocomplete();

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    searchCities(search);
  };

  const handleSelect = (cityName: string) => {
    onChange(cityName);
    setSearchQuery(cityName);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between h-10 bg-background"
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-background z-50" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search cities..."
            value={searchQuery}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading cities...
                </span>
              </div>
            ) : cities.length === 0 && searchQuery.length >= 2 ? (
              <CommandEmpty>No cities found.</CommandEmpty>
            ) : cities.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Type at least 2 characters to search
              </div>
            ) : (
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.name}
                    onSelect={() => handleSelect(city.name)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === city.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>
                      {city.name}, {city.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};