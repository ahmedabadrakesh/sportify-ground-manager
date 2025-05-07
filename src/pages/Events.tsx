import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Link as LinkIcon, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEvents } from "@/hooks/useEvents";
import { useGames } from "@/hooks/useGames";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { isAuthenticatedSync } from "@/utils/auth";
import AuthRequiredDialog from "@/components/auth/AuthRequiredDialog";
import EventDialog from "@/components/admin/events/EventDialog";

const Events = () => {
  const navigate = useNavigate();
  const { events, isLoading } = useEvents();
  const { games } = useGames();
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterSport, setFilterSport] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const eventsPerPage = 6;

  const cities = [...new Set(events.map(event => event.city))];
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.eventName.toLowerCase().includes(search.toLowerCase()) || 
                          event.address.toLowerCase().includes(search.toLowerCase());
    const matchesCity = filterCity ? event.city === filterCity : true;
    const matchesSport = filterSport ? event.sportId === filterSport : true;
    
    return matchesSearch && matchesCity && matchesSport;
  });

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

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

  const handleFilterCityChange = (value: string) => {
    setFilterCity(value === "all" ? "" : value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleFilterSportChange = (value: string) => {
    setFilterSport(value === "all" ? "" : value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleAddEvent = () => {
    if (isAuthenticatedSync()) {
      setEventDialogOpen(true);
    } else {
      setAuthDialogOpen(true);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Upcoming Sports Events</h1>
          <Button 
            className="mt-4 md:mt-0 flex items-center gap-2" 
            onClick={handleAddEvent}
          >
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        </div>
        
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div>
            <Input
              placeholder="Search events..."
              value={search}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={filterCity} onValueChange={handleFilterCityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={filterSport} onValueChange={handleFilterSportChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
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
            {currentEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {event.image ? (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.eventName} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
                  
                  {event.registrationUrl ? (
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => window.open(event.registrationUrl, "_blank")}
                    >
                      <LinkIcon className="h-4 w-4" />
                      Register Now
                    </Button>
                  ) : (
                    <div className="w-full px-4 py-2 text-center text-sm text-gray-500">
                      Registration not available
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {filteredEvents.length > eventsPerPage && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                  // Calculate the page number based on current page
                  let pageNum = idx + 1;
                  if (currentPage > 3 && totalPages > 5) {
                    // If we're past page 3 and there are more than 5 pages,
                    // shift the pagination window to keep current page in middle
                    if (currentPage > totalPages - 2) {
                      // Near the end
                      pageNum = totalPages - 4 + idx;
                    } else {
                      // Middle
                      pageNum = currentPage - 2 + idx;
                    }
                  }
                  
                  return (
                    <PaginationItem key={idx}>
                      <PaginationLink
                        isActive={pageNum === currentPage}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Authentication Required Dialog */}
      <AuthRequiredDialog 
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        title="Authentication Required"
        description="You need to be logged in to create events. Please login or register to continue."
      />

      {/* Event Creation Dialog */}
      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        mode="create"
      />
    </MainLayout>
  );
};

export default Events;
