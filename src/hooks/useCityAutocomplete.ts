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
        // Search for cities with focus on India (countrycodes=in)
        // format=json returns JSON, addressdetails=1 gives us country info
        // featuretype=city limits to cities only
        const response = await fetch(
          `${NOMINATIM_API_BASE}?` +
          `q=${encodeURIComponent(query)}&` +
          `countrycodes=in&` +
          `featuretype=city&` +
          `format=json&` +
          `addressdetails=1&` +
          `limit=10`,
          {
            method: 'GET',
            headers: {
              'User-Agent': 'JokovaApp/1.0' // Nominatim requires a user agent
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
            .filter((place: any) => {
              // Filter to include only cities/towns/villages
              const type = place.type || place.addresstype;
              return ['city', 'town', 'village', 'municipality'].includes(type);
            })
            .map((place: any, index: number) => ({
              id: parseInt(place.place_id) || index,
              name: place.address?.city || 
                    place.address?.town || 
                    place.address?.village || 
                    place.name || 
                    place.display_name.split(',')[0],
              country: place.address?.country || 'India'
            }))
            // Remove duplicates by city name
            .filter((city: City, index: number, self: City[]) => 
              index === self.findIndex((c) => c.name === city.name)
            );
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