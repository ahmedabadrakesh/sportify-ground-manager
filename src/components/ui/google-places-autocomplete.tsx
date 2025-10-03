import React, { useRef, useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PlaceDetails {
  formatted_address: string;
  lat?: number;
  lng?: number;
  place_id?: string;
}

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string, details?: PlaceDetails) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  types?: string[];
  componentRestrictions?: google.maps.places.ComponentRestrictions;
}

export const GooglePlacesAutocomplete = React.forwardRef<
  HTMLInputElement,
  GooglePlacesAutocompleteProps
>(
  (
    {
      value,
      onChange,
      onBlur,
      placeholder,
      disabled,
      className,
      types = [],
      componentRestrictions,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [localValue, setLocalValue] = useState(value);
    const [isApiLoaded, setIsApiLoaded] = useState(false);

    // Check if Google Maps is loaded
    useEffect(() => {
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setIsApiLoaded(true);
        }
      };

      checkGoogleMaps();
      
      // If not loaded initially, set up an interval to check
      const interval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setIsApiLoaded(true);
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }, []);

    // Handle place selection
    const handlePlaceChanged = useCallback(() => {
      const place = autocompleteRef.current?.getPlace();
      if (place) {
        const details: PlaceDetails = {
          formatted_address: place.formatted_address || "",
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
          place_id: place.place_id,
        };
        
        const newValue = place.formatted_address || "";
        setLocalValue(newValue);
        onChange(newValue, details);
      }
    }, [onChange]);

    // Initialize autocomplete
    useEffect(() => {
      if (!isApiLoaded || !inputRef.current || disabled) return;

      try {
        const options: google.maps.places.AutocompleteOptions = {
          componentRestrictions: componentRestrictions || { country: "in" },
          fields: ["formatted_address", "geometry", "place_id", "name"],
        };

        // Only add types if it's a non-empty array
        if (types && Array.isArray(types) && types.length > 0) {
          options.types = types;
        }

        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          options
        );

        // Attach place_changed listener
        const listener = autocompleteRef.current.addListener(
          "place_changed",
          handlePlaceChanged
        );

        return () => {
          if (listener) {
            google.maps.event.removeListener(listener);
          }
        };
      } catch (error) {
        console.error("Error initializing Google Places Autocomplete:", error);
      }
    }, [isApiLoaded, disabled, types, componentRestrictions, handlePlaceChanged]);

    // Sync local value with prop value
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      // Only pass the value when manually typing (no details)
      onChange(newValue, undefined);
    };

    return (
      <Input
        ref={(node) => {
          // Set both refs
          if (node) {
            inputRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }
        }}
        value={localValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(className)}
      />
    );
  }
);

GooglePlacesAutocomplete.displayName = "GooglePlacesAutocomplete";
