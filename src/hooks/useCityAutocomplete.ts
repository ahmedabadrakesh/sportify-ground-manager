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

// Using OpenStreetMap Nominatim API (free, no API key required)
const NOMINATIM_API_BASE = 'https://nominatim.openstreetmap.org/search';

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
        // Search for Indian cities - removed featuretype to allow partial matches
        // Using city=<query> parameter for better city search
        const response = await fetch(
          `${NOMINATIM_API_BASE}?` +
          `city=${encodeURIComponent(query)}&` +
          `countrycodes=in&` +
          `format=json&` +
          `addressdetails=1&` +
          `limit=15`,
          {
            method: 'GET',
            headers: {
              'User-Agent': 'JokovaApp/1.0'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }

        const data = await response.json();
        
        if (data && data.length > 0) {
          // Filter and format city results
          const formattedCities = data
            .map((place: any, index: number) => {
              // Extract city name from various possible fields
              const cityName = place.address?.city || 
                              place.address?.town || 
                              place.address?.village ||
                              place.address?.municipality ||
                              place.name ||
                              place.display_name.split(',')[0].trim();
              
              return {
                id: parseInt(place.place_id) || index,
                name: cityName,
                country: place.address?.country || 'India',
                state: place.address?.state || ''
              };
            })
            // Remove duplicates by city name
            .filter((city: any, index: number, self: any[]) => 
              index === self.findIndex((c) => c.name.toLowerCase() === city.name.toLowerCase())
            )
            // Sort by relevance (shorter names first, then alphabetically)
            .sort((a, b) => {
              if (a.name.length !== b.name.length) {
                return a.name.length - b.name.length;
              }
              return a.name.localeCompare(b.name);
            })
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