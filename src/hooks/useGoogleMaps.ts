import { useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

const libraries: ("places")[] = ["places"];

// Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

export const useGoogleMaps = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const isReady = useMemo(() => isLoaded && !loadError, [isLoaded, loadError]);

  return {
    isLoaded: isReady,
    loadError,
  };
};
