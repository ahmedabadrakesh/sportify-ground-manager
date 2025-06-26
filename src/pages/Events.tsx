import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useEvents } from "@/hooks/useEvents";
import { useGames } from "@/hooks/useGames";
import { isAuthenticatedSync } from "@/utils/auth";
import AuthRequiredDialog from "@/components/auth/AuthRequiredDialog";
import EventDialog from "@/components/admin/events/EventDialog";
import EventsHeader from "@/components/events/EventsHeader";
import EventsFilters from "@/components/events/EventsFilters";
import EventsList from "@/components/events/EventsList";
import EventsPagination from "@/components/events/EventsPagination";
import ExternalRedirectDialog from "@/components/events/ExternalRedirectDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Events = () => {
  const { events, isLoading } = useEvents();
  const { games } = useGames();
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterSport, setFilterSport] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [redirectDialog, setRedirectDialog] = useState({
    open: false,
    url: "",
    eventName: "",
  });
  const eventsPerPage = 6;

  const cities = [...new Set(events.map(event => event.city))];
  
  // Get current date for comparison
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time to start of day
  
  // Separate events into upcoming and past
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.eventDate);
    return eventDate >= currentDate;
  });
  
  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.eventDate);
    return eventDate < currentDate;
  });
  
  const filterEvents = (eventsList: typeof events) => {
    return eventsList.filter(event => {
      const matchesSearch = event.eventName.toLowerCase().includes(search.toLowerCase()) || 
                            event.address.toLowerCase().includes(search.toLowerCase());
      const matchesCity = filterCity ? event.city === filterCity : true;
      const matchesSport = filterSport ? event.sportId === filterSport : true;
      
      return matchesSearch && matchesCity && matchesSport;
    });
  };

  const filteredUpcomingEvents = filterEvents(upcomingEvents);
  const filteredPastEvents = filterEvents(pastEvents);

  // Pagination logic for upcoming events
  const indexOfLastUpcomingEvent = currentPage * eventsPerPage;
  const indexOfFirstUpcomingEvent = indexOfLastUpcomingEvent - eventsPerPage;
  const currentUpcomingEvents = filteredUpcomingEvents.slice(indexOfFirstUpcomingEvent, indexOfLastUpcomingEvent);
  const totalUpcomingPages = Math.ceil(filteredUpcomingEvents.length / eventsPerPage);

  // Pagination logic for past events
  const indexOfLastPastEvent = currentPage * eventsPerPage;
  const indexOfFirstPastEvent = indexOfLastPastEvent - eventsPerPage;
  const currentPastEvents = filteredPastEvents.slice(indexOfFirstPastEvent, indexOfLastPastEvent);
  const totalPastPages = Math.ceil(filteredPastEvents.length / eventsPerPage);

  const getSportName = (sportId?: string) => {
    if (!sportId) return "General";
    const game = games.find(g => g.id === sportId);
    return game ? game.name : "General";
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

  const handleEventClick = (url?: string, eventName?: string) => {
    if (url) {
      setRedirectDialog({
        open: true,
        url,
        eventName: eventName || "Event",
      });
    }
  };

  const handleTabChange = () => {
    setCurrentPage(1); // Reset pagination when switching tabs
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <EventsHeader onAddEvent={handleAddEvent} />
        
        <EventsFilters
          search={search}
          onSearchChange={handleSearchChange}
          filterCity={filterCity}
          onCityChange={handleFilterCityChange}
          filterSport={filterSport}
          onSportChange={handleFilterSportChange}
          cities={cities}
          games={games}
        />
        
        <Tabs defaultValue="upcoming" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            <EventsList
              events={currentUpcomingEvents}
              getSportName={getSportName}
              handleEventClick={handleEventClick}
              isLoading={isLoading}
            />
            
            <EventsPagination 
              currentPage={currentPage} 
              totalPages={totalUpcomingPages}
              onPageChange={setCurrentPage}
            />
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            <EventsList
              events={currentPastEvents}
              getSportName={getSportName}
              handleEventClick={handleEventClick}
              isLoading={isLoading}
            />
            
            <EventsPagination 
              currentPage={currentPage} 
              totalPages={totalPastPages}
              onPageChange={setCurrentPage}
            />
          </TabsContent>
        </Tabs>
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

      {/* External Redirect Confirmation Dialog */}
      <ExternalRedirectDialog
        open={redirectDialog.open}
        onOpenChange={(open) => setRedirectDialog(prev => ({ ...prev, open }))}
        url={redirectDialog.url}
        eventName={redirectDialog.eventName}
      />
    </MainLayout>
  );
};

export default Events;
