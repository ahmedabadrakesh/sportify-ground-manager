
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProfessionalCard from "./ProfessionalCard";
import AuthRequiredDialog from "@/components/auth/AuthRequiredDialog";

interface ProfessionalsListProps {
  sportFilter?: string | null;
}

const ProfessionalsList = ({ sportFilter }: ProfessionalsListProps) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const { data: professionals, isLoading, error } = useQuery({
    queryKey: ["sports-professionals", sportFilter],
    queryFn: async () => {
      console.log("Fetching sports professionals with filter:", sportFilter);
      
      // First, let's try a simple query without joins to see if we can access the table
      const { data: testData, error: testError } = await supabase
        .from("sports_professionals")
        .select("*")
        .limit(1);
      
      console.log("Test query result:", { testData, testError });
      
      // Build the query with optional sport filter
      let query = supabase
        .from("sports_professionals")
        .select(`
          *,
          games!inner (
            name
          )
        `);

      // Apply sport filter if provided
      if (sportFilter) {
        query = query.ilike("games.name", `%${sportFilter}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      console.log("Full query result:", { data, error });
      
      if (error) {
        console.error("Error fetching sports professionals:", error);
        
        // If the join fails, try without the join but still apply filter if needed
        console.log("Trying query without games join...");
        let fallbackQuery = supabase
          .from("sports_professionals")
          .select("*");

        // For fallback, we can't filter by game name directly, so we'll get all and filter client-side if needed
        const { data: fallbackData, error: fallbackError } = await fallbackQuery
          .order("created_at", { ascending: false });
          
        console.log("Fallback query result:", { fallbackData, fallbackError });
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        return fallbackData;
      }
      
      console.log("Number of professionals found:", data?.length || 0);
      return data;
    },
  });

  console.log("ProfessionalsList render - isLoading:", isLoading, "error:", error, "professionals:", professionals);

  const handleLoginClick = () => {
    setIsAuthDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading sports professionals: {error.message}</p>
        <p className="text-sm text-gray-500 mt-2">Check console for more details</p>
      </div>
    );
  }

  if (!professionals || professionals.length === 0) {
    const noDataMessage = sportFilter 
      ? `No ${sportFilter} professionals found. Be the first to register!`
      : "No sports professionals found. Be the first to register!";
    
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{noDataMessage}</p>
        <p className="text-sm text-gray-500 mt-2">
          If you expect to see data here, there might be a permissions issue.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals?.map((professional) => (
          <ProfessionalCard 
            key={professional.id} 
            professional={professional}
            onLoginClick={handleLoginClick}
          />
        ))}
      </div>

      <AuthRequiredDialog 
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        title="Login Required"
        description="Please login or register to view complete contact details."
      />
    </>
  );
};

export default ProfessionalsList;
