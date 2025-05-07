
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Game } from "@/hooks/useGames";

interface EventsFiltersProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterCity: string;
  onCityChange: (value: string) => void;
  filterSport: string;
  onSportChange: (value: string) => void;
  cities: string[];
  games: Game[];
}

const EventsFilters = ({
  search,
  onSearchChange,
  filterCity,
  onCityChange,
  filterSport,
  onSportChange,
  cities,
  games
}: EventsFiltersProps) => {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <div>
        <Input
          placeholder="Search events..."
          value={search}
          onChange={onSearchChange}
          className="w-full"
        />
      </div>
      
      <div>
        <Select value={filterCity} onValueChange={onCityChange}>
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
        <Select value={filterSport} onValueChange={onSportChange}>
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
  );
};

export default EventsFilters;
