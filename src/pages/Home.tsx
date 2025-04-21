
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";

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
  const [hasSearched, setHasSearched] = useState(false);

  const onSearch = (term: string) => {
    if (term.trim()) {
      setSearchTerm(term);
      setHasSearched(true);
    }
  };

  return (
    <MainLayout>
      <HeroSection onSearch={onSearch} />
      <StatBanner />
      <PopularSportsSection />
      <SearchResultsSection 
        searchTerm={searchTerm} 
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
