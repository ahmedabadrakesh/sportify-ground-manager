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
import SportsEventFeed from "@/components/events/SportsEventFeed";

const SportsFeed = () => {
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

  const cities = [...new Set(events.map((event) => event.city))];

  // Get current date for comparison
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time to start of day

  // Separate events into upcoming and past
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate);
    return eventDate >= currentDate;
  });

  const pastEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate);
    return eventDate < currentDate;
  });

  const filterEvents = (eventsList: typeof events) => {
    return eventsList.filter((event) => {
      const matchesSearch =
        event.eventName.toLowerCase().includes(search.toLowerCase()) ||
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
  const currentUpcomingEvents = filteredUpcomingEvents.slice(
    indexOfFirstUpcomingEvent,
    indexOfLastUpcomingEvent
  );
  const totalUpcomingPages = Math.ceil(
    filteredUpcomingEvents.length / eventsPerPage
  );

  // Pagination logic for past events
  const indexOfLastPastEvent = currentPage * eventsPerPage;
  const indexOfFirstPastEvent = indexOfLastPastEvent - eventsPerPage;
  const currentPastEvents = filteredPastEvents.slice(
    indexOfFirstPastEvent,
    indexOfLastPastEvent
  );
  const totalPastPages = Math.ceil(filteredPastEvents.length / eventsPerPage);

  const getSportName = (sportId?: string) => {
    if (!sportId) return "General";
    const game = games.find((g) => g.id === sportId);
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
        <SportsEventFeed />
      </div>
    </MainLayout>
  );
};

export default SportsFeed;
