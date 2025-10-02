import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
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

    // Initialize autocomplete
    useEffect(() => {
      if (!isApiLoaded || !inputRef.current || disabled) return;

      try {
        const options: google.maps.places.AutocompleteOptions = {
          types,
          componentRestrictions: componentRestrictions || { country: "in" },
        };

        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          options
        );

        const listener = autocompleteRef.current.addListener(
          "place_changed",
          () => {
            const place = autocompleteRef.current?.getPlace();
            if (place && place.formatted_address) {
              const newValue = place.formatted_address;
              setLocalValue(newValue);
              onChange(newValue);
            }
          }
        );

        return () => {
          if (listener) {
            google.maps.event.removeListener(listener);
          }
        };
      } catch (error) {
        console.error("Error initializing Google Places Autocomplete:", error);
      }
    }, [isApiLoaded, disabled, types, componentRestrictions, onChange]);

    // Sync local value with prop value
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange(newValue);
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
