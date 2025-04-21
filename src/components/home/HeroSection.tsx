
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
    <div className="relative overflow-hidden mb-16"> {/* Add bottom margin here */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        src="https://techitree.s3.ap-south-1.amazonaws.com/header_videdo.mp4"
      ></video>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10"></div>
      
      <div className="relative z-20 py-24 md:py-32 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find and Book Sports Grounds Near You
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Discover the perfect venue for your game, book instantly, and play without hassle
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by sport, location or ground name"
                className="pl-10 py-6 bg-white/95 text-gray-800 rounded-lg w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="px-8 py-6 text-lg">
              Search
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="text-gray-300">Popular searches:</span>
            <button
              onClick={() => {
                setSearchInput("Cricket");
                onSearch("Cricket");
              }}
              className="text-white hover:text-primary-300 transition"
            >
              Cricket
            </button>
            <button
              onClick={() => {
                setSearchInput("Football");
                onSearch("Football");
              }}
              className="text-white hover:text-primary-300 transition"
            >
              Football
            </button>
            <button
              onClick={() => {
                setSearchInput("Tennis");
                onSearch("Tennis");
              }}
              className="text-white hover:text-primary-300 transition"
            >
              Tennis
            </button>
            <button
              onClick={() => {
                setSearchInput("Badminton");
                onSearch("Badminton");
              }}
              className="text-white hover:text-primary-300 transition"
            >
              Badminton
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
