import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import PopularSportsSection from "@/components/home/PopularSportsSection";
import SearchResultsSection from "@/components/home/SearchResultsSection";
import FeaturedGroundsSection from "@/components/home/FeaturedGroundsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ShopPromotionSection from "@/components/home/ShopPromotionSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import StatBanner from "@/components/home/StatBanner";
import SportsProfessionalsPromotion from "@/components/home/SportsProfessionalsPromotion";
import EventsPromotion from "@/components/home/EventsPromotion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUserSync } from "@/utils/auth";
import AuthRequiredDialog from "@/components/auth/AuthRequiredDialog";
import EventDialog from "@/components/admin/events/EventDialog";

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount and listen for changes
  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUserSync();
      setIsAuthenticated(!!user);
    };

    // Check initial auth state
    checkAuth();

    // Listen for auth state changes
    const handleAuthStateChange = () => {
      checkAuth();
    };

    window.addEventListener("authStateChanged", handleAuthStateChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthStateChange);
    };
  }, []);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      setSearchTerm(term);
      setHasSearched(true);
    }
  };

  const handleAddEvent = () => {
    if (isAuthenticated) {
      setEventDialogOpen(true);
    } else {
      setAuthDialogOpen(true);
    }
  };

  return (
    <MainLayout>
      <HeroSection onSearch={handleSearch} />
      <div>
        <SportsProfessionalsPromotion />
        <PopularSportsSection />
        <SearchResultsSection
          searchTerm={searchTerm}
          hasSearched={hasSearched}
        />
        <FeaturedGroundsSection />
        <StatBanner />
      </div>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Events</h2>
            <Button
              onClick={handleAddEvent}
              className="mt-4 md:mt-0 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Event
            </Button>
          </div>
        </div>
        <EventsPromotion />
      </div>
      <div className="container mx-auto px-4">
        <HowItWorksSection />
        <TestimonialsSection />
        <ShopPromotionSection />
        <WhyChooseUsSection />
      </div>

      {/* Authentication Required Dialog */}
      <AuthRequiredDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        title="Authentication Required"
        description="You need to be logged in to create events. Please login or register to continue."
      />

      {/* Event Creation Dialog */}
      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        mode="create"
      />
    </MainLayout>
  );
};

export default Home;
