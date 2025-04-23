
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

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      setSearchTerm(term);
      setHasSearched(true);
    }
  };

  return (
    <MainLayout>
      <HeroSection onSearch={handleSearch} />
      <div className="container mx-auto px-4">
        <PopularSportsSection />
        <SearchResultsSection 
          searchTerm={searchTerm} 
          hasSearched={hasSearched} 
        />
        <SportsProfessionalsPromotion />
        <StatBanner />
        <FeaturedGroundsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <ShopPromotionSection />
        <WhyChooseUsSection />
      </div>
    </MainLayout>
  );
};

export default Home;
