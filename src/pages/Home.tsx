import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import SEOHead from "@/components/SEOHead";
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
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUserSync } from "@/utils/auth";
import AuthRequiredDialog from "@/components/auth/AuthRequiredDialog";
import EventDialog from "@/components/admin/events/EventDialog";
import { useNavigate } from "react-router-dom";
import FeaturedSection from "@/components/home/FeaturedSection";
import HomeCoachingSection from "@/components/home/HomeCoachingSection";
import CorporateWellness from "@/components/home/CorporateWellness";
import ExperienceSection from "@/components/home/ExperienceSection";

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jokova",
    url: "https://jokova.com",
    logo: "https://jokova.com/green_text_only_logo.png",
    description:
      "Book sports grounds, find certified sports professionals, and join events. Your one-stop platform for all sports activities.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      "https://twitter.com/jokova",
      "https://facebook.com/jokova",
      "https://instagram.com/jokova",
    ],
  };

  return (
    <MainLayout>
      <SEOHead
        title="Jokova - Book Sports Grounds & Find Professional Coaches"
        description="Book sports grounds, find certified sports professionals, and join events. Jokova is your one-stop platform for all sports activities in India."
        keywords="sports, ground booking, sports professionals, coaches, sports events, fitness, sports facilities, cricket, football, tennis, badminton"
        canonicalUrl="https://jokova.com"
        structuredData={structuredData}
      />
      <HeroSection onSearch={handleSearch} />
      <StatBanner />
      <div>
        <PopularSportsSection />
        <FeaturedSection />
        <HomeCoachingSection />
        <CorporateWellness />
        <ExperienceSection />
        <SportsProfessionalsPromotion />
        <SearchResultsSection
          searchTerm={searchTerm}
          hasSearched={hasSearched}
        />
        {/* <FeaturedGroundsSection /> */}
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Events</h2>
              <div className="flex flex-row gap-2">
                <Button
                  onClick={handleAddEvent}
                  className="mt-4 md:mt-0 flex items-center gap-2"
                >
                  Add Event
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  className="mt-4 md:mt-0 flex items-center gap-2"
                  onClick={() => navigate("/events")}
                >
                  View All Events <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <EventsPromotion />
        </div>
        {/* <StatBanner /> */}
      </div>

      {/* <HowItWorksSection /> */}
      <ShopPromotionSection />
      {/* <WhyChooseUsSection /> */}

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
