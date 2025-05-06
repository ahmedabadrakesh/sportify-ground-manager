
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEvents } from "@/hooks/useEvents";
import { useGames } from "@/hooks/useGames";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Events = () => {
  const navigate = useNavigate();
  const { events, isLoading } = useEvents();
  const { games } = useGames();
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterSport, setFilterSport] = useState("");

  const cities = [...new Set(events.map(event => event.city))];
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.eventName.toLowerCase().includes(search.toLowerCase()) || 
                          event.address.toLowerCase().includes(search.toLowerCase());
    const matchesCity = filterCity ? event.city === filterCity : true;
    const matchesSport = filterSport ? event.sportId === filterSport : true;
    
    return matchesSearch && matchesCity && matchesSport;
  });

  const getSportName = (sportId?: string) => {
    if (!sportId) return "General";
    const game = games.find(g => g.id === sportId);
    return game ? game.name : "General";
  };

  const formatEventDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Sports Events</h1>
        
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div>
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={filterSport} onValueChange={setFilterSport}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sports</SelectItem>
                {games.map(game => (
                  <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">No events found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                {event.image ? (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.eventName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
                      {getSportName(event.sportId)}
                    </span>
                    <span className="text-sm text-muted-foreground">{formatEventDate(event.eventDate)}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{event.eventName}</h3>
                  
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{event.address}, {event.city}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{event.eventTime}</span>
                  </div>
                  
                  {event.registrationUrl && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(event.registrationUrl, "_blank")}
                    >
                      Register Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Events;
