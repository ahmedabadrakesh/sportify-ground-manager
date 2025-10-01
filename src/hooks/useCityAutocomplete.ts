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

// Using GeoDB Cities API (free tier: 1000 requests/day, max 10 requests/second)
const GEODB_API_BASE = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const RAPIDAPI_KEY = 'demo'; // Using demo key for development

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
        const response = await fetch(
          `${GEODB_API_BASE}/cities?namePrefix=${encodeURIComponent(query)}&limit=10&sort=-population`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }

        const data = await response.json();
        
        if (data.data) {
          const formattedCities = data.data.map((city: any) => ({
            id: city.id,
            name: city.name,
            country: city.country
          }));
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