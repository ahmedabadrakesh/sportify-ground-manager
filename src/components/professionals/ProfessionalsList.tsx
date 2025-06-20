
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProfessionalCard from "./ProfessionalCard";

const ProfessionalsList = () => {
  const { data: professionals, isLoading, error } = useQuery({
    queryKey: ["sports-professionals"],
    queryFn: async () => {
      console.log("Fetching sports professionals...");
      
      // First, let's try a simple query without joins to see if we can access the table
      const { data: testData, error: testError } = await supabase
        .from("sports_professionals")
        .select("*")
        .limit(1);
      
      console.log("Test query result:", { testData, testError });
      
      // Now try the full query with join
      const { data, error } = await supabase
        .from("sports_professionals")
        .select(`
          *,
          games!inner (
            name
          )
        `)
        .order("created_at", { ascending: false });

      console.log("Full query result:", { data, error });
      
      if (error) {
        console.error("Error fetching sports professionals:", error);
        
        // If the join fails, try without the join
        console.log("Trying query without games join...");
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("sports_professionals")
          .select("*")
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
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No sports professionals found. Be the first to register!</p>
        <p className="text-sm text-gray-500 mt-2">
          If you expect to see data here, there might be a permissions issue.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {professionals?.map((professional) => (
        <ProfessionalCard key={professional.id} professional={professional} />
      ))}
    </div>
  );
};

export default ProfessionalsList;
