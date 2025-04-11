import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
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
  
  // Get all unique facilities from all grounds
  const allFacilities = Array.from(
    new Set(
      getAvailableGrounds()
        .flatMap((ground) => ground.facilities)
    )
  );
  
  // Get all unique sports from all grounds
  const allSports = Array.from(
    new Set(
      getAvailableGrounds()
        .flatMap((ground) => ground.games)
    )
  );

  useEffect(() => {
    // Initial load or when URL params change
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

  const applyFilters = (query: string, sport: string, facilities: string[]) => {
    let filtered = getAvailableGrounds();
    
    // Filter by search term
    if (query) {
      filtered = filtered.filter(
        (ground) =>
          ground.name.toLowerCase().includes(query.toLowerCase()) ||
          ground.address.toLowerCase().includes(query.toLowerCase()) ||
          ground.games.some((game) =>
            game.toLowerCase().includes(query.toLowerCase())
          )
      );
    }
    
    // Filter by sport
    if (sport) {
      filtered = filtered.filter((ground) =>
        ground.games.some((game) =>
          game.toLowerCase() === sport.toLowerCase()
        )
      );
    }
    
    // Filter by facilities
    if (facilities.length > 0) {
      filtered = filtered.filter((ground) =>
        facilities.every((facility) => ground.facilities.includes(facility))
      );
    }
    
    setGrounds(filtered);
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSport("");
    setSelectedFacilities([]);
    setSearchParams({});
    setGrounds(getAvailableGrounds());
  };

  return (
    <MainLayout>
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
          {grounds.length > 0 ? (
            <p className="text-gray-600">Showing {grounds.length} results</p>
          ) : (
            <p className="text-gray-600">No grounds found</p>
          )}
        </div>
        
        <Button variant="ghost" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {grounds.map((ground) => (
          <GroundCard key={ground.id} ground={ground} />
        ))}
      </div>

      {grounds.length === 0 && (
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
