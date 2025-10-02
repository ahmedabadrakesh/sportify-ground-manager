import React from "react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  children,
}) => {
  const { isLoaded, loadError } = useGoogleMaps();

  if (loadError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load Google Maps. Location autocomplete will not be available.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isLoaded) {
    return <div className="animate-pulse">Loading location services...</div>;
  }

  return <>{children}</>;
};
