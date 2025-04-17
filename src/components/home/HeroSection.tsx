
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="relative mb-6">
      <div className="relative overflow-hidden rounded-3xl">
        {/* Video Background with Overlay */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10"></div>
          <video 
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://techitree.s3.ap-south-1.amazonaws.com/header_videdo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                Find and Book <span className="text-primary-400">Sports Grounds</span> Near You
              </h1>
              <p className="text-xl opacity-90 mb-8 text-white">
                Discover the perfect venue for your game. Easy booking, instant confirmation.
              </p>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-1 flex flex-col md:flex-row md:items-center gap-2">
                <div className="flex-1 flex items-center pl-3">
                  <Search size={20} className="text-gray-500 mr-2" />
                  <Input
                    type="text"
                    placeholder="Search by sport, location, or ground name..."
                    className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button 
                  className="rounded-lg md:rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  size="lg"
                  onClick={onSearch}
                >
                  Search Now
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <QuickSearchButton label="Football" icon={<MapPin size={14} />} onClick={() => navigate("/search?sport=Football")} />
                <QuickSearchButton label="Cricket" icon={<MapPin size={14} />} onClick={() => navigate("/search?sport=Cricket")} />
                <QuickSearchButton label="Tennis" icon={<MapPin size={14} />} onClick={() => navigate("/search?sport=Tennis")} />
                <QuickSearchButton label="Basketball" icon={<MapPin size={14} />} onClick={() => navigate("/search?sport=Basketball")} />
                <QuickSearchButton 
                  label="All Sports" 
                  icon={<ChevronRight size={14} />} 
                  onClick={() => navigate("/search")}
                  variant="secondary" 
                />
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:block w-1/3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary-600 rounded-full opacity-20 animate-pulse delay-300"></div>
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Today's Matches</p>
                      <p className="text-lg font-semibold">120+ available</p>
                    </div>
                    <div className="bg-primary-100 text-primary-600 p-2 rounded-full">
                      <Calendar size={20} />
                    </div>
                  </div>
                  {[1, 2, 3].map((_, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg mb-3 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                        {index === 0 && <span className="font-semibold">FB</span>}
                        {index === 1 && <span className="font-semibold">TN</span>}
                        {index === 2 && <span className="font-semibold">CR</span>}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{index === 0 ? "Football Ground" : index === 1 ? "Tennis Court" : "Cricket Stadium"}</p>
                        <p className="text-xs text-gray-500">3 km away • {index === 0 ? "₹1,200" : index === 1 ? "₹800" : "₹2,000"}/hr</p>
                      </div>
                    </div>
                  ))}
                  <Button 
                    className="w-full mt-2" 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/search")}
                  >
                    View All Grounds
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickSearchButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

const QuickSearchButton = ({ label, icon, onClick, variant = "primary" }: QuickSearchButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`
        ${variant === "primary" 
          ? "bg-white/20 hover:bg-white/30 border-white/40 text-white" 
          : "bg-white/90 hover:bg-white border-primary-200 text-primary-700"}
        gap-1 rounded-full transition-transform hover:scale-105
      `}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
};

export default HeroSection;
