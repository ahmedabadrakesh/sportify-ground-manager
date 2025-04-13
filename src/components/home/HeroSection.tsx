import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const onSearch = () => {
    if (searchTerm.trim()) {
      navigate("/search", { state: { searchTerm } });
    }
  };

  return (
    <div className="relative mb-12 pb-8">
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img 
            src="/lovable-uploads/abf3239e-af73-47ea-9adc-c6138959a349.png" 
            alt="Sports Team Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find and Book Sports Grounds Near You
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Discover the perfect venue for your game. Easy booking, instant confirmation.
            </p>

            <div className="flex items-center bg-white rounded-lg shadow-lg p-1 text-gray-900">
              <div className="flex-1 flex items-center pl-3">
                <Search size={20} className="text-gray-400 mr-2" />
                <Input
                  type="text"
                  placeholder="Search by sport, location, or ground name..."
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button className="rounded-md" onClick={onSearch}>
                Search
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 border-white/40 text-white"
                onClick={() => navigate("/search?sport=Football")}
              >
                Football
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 border-white/40 text-white"
                onClick={() => navigate("/search?sport=Cricket")}
              >
                Cricket
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 border-white/40 text-white"
                onClick={() => navigate("/search?sport=Tennis")}
              >
                Tennis
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 border-white/40 text-white"
                onClick={() => navigate("/search?sport=Basketball")}
              >
                Basketball
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
