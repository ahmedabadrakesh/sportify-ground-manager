import { useState, useEffect, useCallback } from 'react';

interface City {
  id: number;
  name: string;
  country: string;
}

interface UseCityAutocompleteReturn {
  cities: City[];
  isLoading: boolean;
  error: string | null;
  searchCities: (query: string) => void;
}

// Using GeoNames Search API (free with registration, demo for development)
// Register at https://www.geonames.org/login for production use
const GEONAMES_API_BASE = 'http://api.geonames.org/searchJSON';
const GEONAMES_USERNAME = 'demo'; // Replace with registered username for production

export const useCityAutocomplete = (): UseCityAutocompleteReturn => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const searchCities = useCallback((query: string) => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // If query is too short, clear results
    if (!query || query.length < 2) {
      setCities([]);
      setError(null);
      return;
    }

    // Set new debounce timer (500ms delay)
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Search for Indian cities using GeoNames API
        // name_startsWith enables autocomplete functionality
        // featureClass=P filters for populated places (cities, towns)
        const response = await fetch(
          `${GEONAMES_API_BASE}?` +
          `name_startsWith=${encodeURIComponent(query)}&` +
          `country=IN&` +
          `featureClass=P&` +
          `maxRows=15&` +
          `username=${GEONAMES_USERNAME}&` +
          `style=SHORT`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }

        const data = await response.json();
        
        if (data.geonames && data.geonames.length > 0) {
          // Format city results
          const formattedCities = data.geonames
            .map((place: any) => ({
              id: place.geonameId,
              name: place.name,
              country: 'India',
              state: place.adminName1 || ''
            }))
            // Remove duplicates by city name
            .filter((city: any, index: number, self: any[]) => 
              index === self.findIndex((c) => c.name.toLowerCase() === city.name.toLowerCase())
            )
            .slice(0, 10);
          
          setCities(formattedCities);
        } else {
          setCities([]);
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('Failed to fetch cities');
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce delay

    setDebounceTimer(timer);
  }, [debounceTimer]);

  return { cities, isLoading, error, searchCities };
};