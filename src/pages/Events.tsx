
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

const Events = () => {
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

  const handleEventClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
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
        
        <EventsList
          events={currentEvents}
          getSportName={getSportName}
          handleEventClick={handleEventClick}
          isLoading={isLoading}
        />
        
        <EventsPagination 
          currentPage={currentPage} 
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
