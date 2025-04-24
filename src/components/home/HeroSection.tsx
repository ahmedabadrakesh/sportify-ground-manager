
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onSearch: (term: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  return (
    <div className="relative overflow-hidden mb-16"> 
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        src="https://techitree.s3.ap-south-1.amazonaws.com/header_videdo.mp4"
      ></video>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60 z-10"></div>
      
      <div className="relative z-20 py-28 md:py-36 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find and Book <span className="text-blue-400">Sports Grounds</span> Near You
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 text-gray-200">
            Discover the perfect venue for your game, book instantly, and play without hassle
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-10 max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by sport, location or ground name"
                className="pl-12 py-7 bg-white/95 text-gray-800 rounded-full w-full text-lg shadow-lg"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="px-8 py-7 text-lg bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg"
            >
              Search
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="text-gray-300">Popular searches:</span>
            {["Cricket", "Football", "Tennis", "Badminton"].map((sport) => (
              <button
                key={sport}
                onClick={() => {
                  setSearchInput(sport);
                  onSearch(sport);
                }}
                className="text-white bg-white/20 hover:bg-white/30 transition px-4 py-1 rounded-full"
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
