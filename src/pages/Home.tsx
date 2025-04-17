
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { getAvailableGrounds } from "@/utils/booking";
import { Ground } from "@/types/models";

// Import all the component sections
import HeroSection from "@/components/home/HeroSection";
import PopularSportsSection from "@/components/home/PopularSportsSection";
import SearchResultsSection from "@/components/home/SearchResultsSection";
import FeaturedGroundsSection from "@/components/home/FeaturedGroundsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ShopPromotionSection from "@/components/home/ShopPromotionSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import StatBanner from "@/components/home/StatBanner";

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGrounds, setFilteredGrounds] = useState<Ground[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const onSearch = () => {
    if (searchTerm.trim()) {
      const grounds = getAvailableGrounds(searchTerm);
      setFilteredGrounds(grounds);
      setHasSearched(true);
    }
  };

  return (
    <MainLayout>
      <HeroSection />
      <StatBanner />
      <PopularSportsSection />
      <SearchResultsSection 
        searchTerm={searchTerm} 
        filteredGrounds={filteredGrounds} 
        hasSearched={hasSearched} 
      />
      <FeaturedGroundsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <ShopPromotionSection />
      <WhyChooseUsSection />
    </MainLayout>
  );
};

export default Home;
