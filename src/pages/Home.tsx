
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import GroundCard from "@/components/grounds/GroundCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAvailableGrounds } from "@/utils/booking";
import { Search, MapPin } from "lucide-react";
import { Ground } from "@/types/models";

const Home: React.FC = () => {
  const navigate = useNavigate();
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative mb-12 pb-8">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-3xl overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
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

      {/* Search Results */}
      {hasSearched && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Search Results for "{searchTerm}"
            </h2>
            <Button
              variant="outline"
              onClick={() => navigate("/search", { state: { searchTerm } })}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrounds.map((ground) => (
              <GroundCard key={ground.id} ground={ground} />
            ))}
          </div>

          {filteredGrounds.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                No grounds found for your search. Try a different term or browse all grounds.
              </p>
              <Button onClick={() => navigate("/search")}>Browse All Grounds</Button>
            </div>
          )}
        </div>
      )}

      {/* Featured Grounds */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Grounds</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getAvailableGrounds()
            .slice(0, 3)
            .map((ground) => (
              <GroundCard key={ground.id} ground={ground} />
            ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/search")}
            className="px-8"
          >
            View All Grounds
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Why Choose SportifyGround?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Discovery</h3>
            <p className="text-gray-600">
              Find the perfect ground for your sport in your vicinity with our powerful search.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nearby Locations</h3>
            <p className="text-gray-600">
              Discover sports grounds near you with detailed information and facilities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Booking</h3>
            <p className="text-gray-600">
              Book your slot in minutes with our seamless booking system and secure payments.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
