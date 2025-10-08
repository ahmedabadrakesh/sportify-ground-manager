import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Add styles for Google Places Autocomplete dropdown
const autocompleteStyles = `
  .pac-container {
    z-index: 99999 !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    border: 1px solid #e5e7eb !important;
    background-color: white !important;
    margin-top: 4px !important;
    pointer-events: auto !important;
  }
  .pac-item {
    padding: 8px 12px !important;
    cursor: pointer !important;
    color: #1f2937 !important;
    border-top: 1px solid #e5e7eb !important;
    pointer-events: auto !important;
  }
  .pac-item:first-child {
    border-top: none !important;
  }
  .pac-item:hover,
  .pac-item-selected {
    background-color: #f3f4f6 !important;
    color: #111827 !important;
  }
  .pac-icon {
    display: none;
  }
  .pac-item-query {
    color: #111827 !important;
    font-weight: 500 !important;
  }
  .pac-matched {
    font-weight: 700 !important;
  }
`;

export interface PlaceDetails {
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
      types,
      componentRestrictions,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(
      null
    );
    const isSelectingRef = useRef(false);
    const styleRef = useRef<HTMLStyleElement | null>(null);

    // Inject styles for autocomplete dropdown
    useEffect(() => {
      if (!styleRef.current) {
        const style = document.createElement("style");
        style.textContent = autocompleteStyles;
        document.head.appendChild(style);
        styleRef.current = style;
      }

      return () => {
        if (styleRef.current) {
          document.head.removeChild(styleRef.current);
          styleRef.current = null;
        }
      };
    }, []);

    // Initialize autocomplete when Google Maps is loaded
    useEffect(() => {
      if (!inputRef.current || disabled) return;

      // Wait for Google Maps to load
      const initAutocomplete = () => {
        if (!window.google?.maps?.places) {
          setTimeout(initAutocomplete, 100);
          return;
        }

        // Clean up previous instance
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }

        try {
          const options: google.maps.places.AutocompleteOptions = {
            componentRestrictions: componentRestrictions || { country: "in" },
            fields: ["formatted_address", "geometry", "place_id", "name"],
          };

          // Only add types if provided and valid
          if (types && types.length > 0) {
            options.types = types;
          }

          const autocomplete = new google.maps.places.Autocomplete(
            inputRef.current,
            options
          );

          autocompleteRef.current = autocomplete;

          // Listen for place selection
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place?.formatted_address) {
              isSelectingRef.current = true;

              const details: PlaceDetails = {
                formatted_address: place.formatted_address,
                lat: place.geometry?.location?.lat(),
                lng: place.geometry?.location?.lng(),
                place_id: place.place_id,
              };
              // Call onChange with the formatted address and details
              onChange(place.formatted_address, details);

              // Reset flag after a short delay
              setTimeout(() => {
                isSelectingRef.current = false;
              }, 100);
            }
          });
        } catch (error) {
          console.error(
            "Error initializing Google Places Autocomplete:",
            error
          );
        }
      };

      initAutocomplete();

      // return () => {
      //   if (autocompleteRef.current) {
      //     google.maps.event.clearInstanceListeners(autocompleteRef.current);
      //   }
      // };
    }, [disabled, componentRestrictions, types, onChange]);

    // Sync input value with prop value
    useEffect(() => {
      if (inputRef.current && !isSelectingRef.current) {
        inputRef.current.value = value || "";
      }
    }, [value]);

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   if (!isSelectingRef.current) {
    //     onChange(e.target.value, undefined);
    //   }
    // };

    return (
      <Input
        ref={(node) => {
          if (node) {
            inputRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }
        }}
        defaultValue={value}
        //onChange={handleInputChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(className)}
        autoComplete="on"
      />
    );
  }
);

GooglePlacesAutocomplete.displayName = "GooglePlacesAutocomplete";
