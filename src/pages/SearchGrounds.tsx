
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import SEOHead from "@/components/SEOHead";
import GroundCard from "@/components/grounds/GroundCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAvailableGrounds } from "@/utils/booking";
import { Search, Filter, MapPin } from "lucide-react";
import { Ground } from "@/types/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const SearchGrounds: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialSport = searchParams.get('sport') || "";
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('q') || "");
  const [selectedSport, setSelectedSport] = useState<string>(initialSport);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [allFacilities, setAllFacilities] = useState<string[]>([]);
  const [allSports, setAllSports] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load all grounds to get the unique facilities and sports
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const allGrounds = await getAvailableGrounds();
        
        // Get all unique facilities from all grounds
        const facilitiesSet = new Set<string>();
        allGrounds.forEach(ground => {
          ground.facilities.forEach(facility => facilitiesSet.add(facility));
        });
        
        // Get all unique sports from all grounds
        const sportsSet = new Set<string>();
        allGrounds.forEach(ground => {
          ground.games.forEach(game => sportsSet.add(game));
        });
        
        setAllFacilities(Array.from(facilitiesSet));
        setAllSports(Array.from(sportsSet));
        
        // Apply any initial filters
        applyFilters(searchTerm, selectedSport, selectedFacilities);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  useEffect(() => {
    // When URL params change
    const sportParam = searchParams.get('sport');
    const queryParam = searchParams.get('q');
    
    if (sportParam && sportParam !== selectedSport) {
      setSelectedSport(sportParam);
    }
    
    if (queryParam && queryParam !== searchTerm) {
      setSearchTerm(queryParam);
    }
    
    applyFilters(queryParam || searchTerm, sportParam || selectedSport, selectedFacilities);
  }, [searchParams]);

  const applyFilters = async (query: string, sport: string, facilities: string[]) => {
    try {
      setLoading(true);
      let filteredGrounds = await getAvailableGrounds(sport !== "all-sports" ? sport : undefined);
      
      // Filter by search term
      if (query) {
        filteredGrounds = filteredGrounds.filter(
          (ground) =>
            ground.name.toLowerCase().includes(query.toLowerCase()) ||
            ground.address.toLowerCase().includes(query.toLowerCase()) ||
            ground.games.some((game) =>
              game.toLowerCase().includes(query.toLowerCase())
            )
        );
      }
      
      // Filter by facilities
      if (facilities.length > 0) {
        filteredGrounds = filteredGrounds.filter((ground) =>
          facilities.every((facility) => ground.facilities.includes(facility))
        );
      }
      
      setGrounds(filteredGrounds);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Update URL params
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set('q', searchTerm);
    if (selectedSport) newParams.set('sport', selectedSport);
    setSearchParams(newParams);
    
    applyFilters(searchTerm, selectedSport, selectedFacilities);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSportChange = (value: string) => {
    setSelectedSport(value);
  };

  const handleFacilityChange = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  const applyFiltersAndCloseSheet = () => {
    handleSearch();
  };

  const clearFilters = async () => {
    setSearchTerm("");
    setSelectedSport("");
    setSelectedFacilities([]);
    setSearchParams({});
    
    try {
      setLoading(true);
      const allGrounds = await getAvailableGrounds();
      setGrounds(allGrounds);
    } catch (error) {
      console.error("Error clearing filters:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <SEOHead
        title="Search Sports Grounds | Book Sports Facilities | Jokova"
        description="Search and book sports grounds, cricket grounds, football fields, tennis courts, and more sports facilities across India. Find the perfect venue for your sports activities."
        keywords="search sports grounds, book sports facilities, cricket ground, football field, tennis court, sports venue booking"
        canonicalUrl="https://jokova.com/search"
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Ground</h1>
        <p className="text-gray-600">
          Search from our wide selection of sports grounds and book instantly.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center">
            <Search size={20} className="text-gray-400 mr-2" />
            <Input
              type="text"
              placeholder="Search grounds, locations, or sports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select
              value={selectedSport}
              onValueChange={handleSportChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-sports">All Sports</SelectItem>
                {allSports.map((sport) => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter size={18} className="mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Grounds</SheetTitle>
              </SheetHeader>
              
              <div className="py-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Facilities</h3>
                  <div className="space-y-2">
                    {allFacilities.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={`facility-${facility}`}
                          checked={selectedFacilities.includes(facility)}
                          onCheckedChange={() => handleFacilityChange(facility)}
                        />
                        <Label htmlFor={`facility-${facility}`}>{facility}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-6">
                <SheetClose asChild>
                  <Button className="flex-1" onClick={applyFiltersAndCloseSheet}>
                    Apply Filters
                  </Button>
                </SheetClose>
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button onClick={handleSearch} className="w-full md:w-auto">
            Search
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          {loading ? (
            <p className="text-gray-600">Loading grounds...</p>
          ) : grounds.length > 0 ? (
            <p className="text-gray-600">Showing {grounds.length} results</p>
          ) : (
            <p className="text-gray-600">No grounds found</p>
          )}
        </div>
        
        <Button variant="ghost" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {grounds.map((ground) => (
            <GroundCard key={ground.id} ground={ground} />
          ))}
        </div>
      )}

      {!loading && grounds.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            No grounds found matching your criteria. Try adjusting your filters.
          </p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      )}
    </MainLayout>
  );
};

export default SearchGrounds;
