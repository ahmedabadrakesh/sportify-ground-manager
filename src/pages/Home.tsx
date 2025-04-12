import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import GroundCard from "@/components/grounds/GroundCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAvailableGrounds } from "@/utils/booking";
import { Search, MapPin, Users, Calendar, Check, Star, ShoppingBag, Info, ArrowRight } from "lucide-react";
import { Ground } from "@/types/models";
import { Card, CardContent } from "@/components/ui/card";
import { getBookingsCount, getRegisteredGroundsCount, getCitiesCovered } from "@/utils/stats";
import { getClientReviews } from "@/utils/reviews";
import CountUp from "react-countup";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGrounds, setFilteredGrounds] = useState<Ground[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [stats, setStats] = useState({
    grounds: 0,
    bookings: 0,
    cities: 0
  });

  useEffect(() => {
    setStats({
      grounds: getRegisteredGroundsCount(),
      bookings: getBookingsCount(),
      cities: getCitiesCovered().length
    });
  }, []);

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

  const reviews = getClientReviews();

  return (
    <MainLayout>
      <div className="bg-primary-800 text-white py-6 mb-8 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold flex items-center">
                    <CountUp end={stats.grounds} duration={2.5} />
                    <span className="ml-1 text-sm px-2 py-1 bg-white/20 rounded-full">Grounds</span>
                  </div>
                  <span className="text-sm">Registered</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold flex items-center">
                    <CountUp end={stats.bookings} duration={2.5} />
                    <span className="ml-1 text-sm px-2 py-1 bg-white/20 rounded-full">Bookings</span>
                  </div>
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold flex items-center">
                    <CountUp end={stats.cities} duration={2.5} />
                    <span className="ml-1 text-sm px-2 py-1 bg-white/20 rounded-full">Cities</span>
                  </div>
                  <span className="text-sm">Covered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mb-12 pb-8">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 w-full h-full overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <video 
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/hero-background.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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

      <div className="mb-16 py-12 bg-gray-50 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Find a Ground</h3>
              <p className="text-gray-600">
                Search for sports grounds based on your location, preferred sport, or venue name.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Book a Slot</h3>
              <p className="text-gray-600">
                Choose from available time slots, select the date and duration that works for you.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Confirm & Play</h3>
              <p className="text-gray-600">
                Make the payment securely online and receive instant confirmation. Show up and play!
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button onClick={() => navigate("/search")} className="px-8">
              Book Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Clients Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">{review.rating}/5</span>
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl overflow-hidden text-white">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 mb-8 md:mb-0 md:pr-12">
            <h2 className="text-3xl font-bold mb-4">Shop Premium Sports Equipment</h2>
            <p className="text-lg opacity-90 mb-6">
              Get high-quality sports equipment delivered right to your door. From balls to bats, we've got everything you need for your game.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-indigo-700 hover:bg-gray-100"
              onClick={() => navigate("/shop")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now
            </Button>
          </div>
          <div className="md:w-2/5 flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                <div className="h-24 w-24 bg-white/10 rounded-full mx-auto mb-2"></div>
                <p className="text-center font-medium">Cricket Bats</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                <div className="h-24 w-24 bg-white/10 rounded-full mx-auto mb-2"></div>
                <p className="text-center font-medium">Footballs</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                <div className="h-24 w-24 bg-white/10 rounded-full mx-auto mb-2"></div>
                <p className="text-center font-medium">Tennis Rackets</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                <div className="h-24 w-24 bg-white/10 rounded-full mx-auto mb-2"></div>
                <p className="text-center font-medium">Sports Attire</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <Info size={24} />
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
