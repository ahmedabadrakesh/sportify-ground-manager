
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGames } from "@/hooks/useGames";

interface BookingGamesPickerProps {
  games: string[]; // these might be IDs or codes
  selectedGame: string;
  setSelectedGame: (game: string) => void;
  required?: boolean;
}

const BookingGamesPicker: React.FC<BookingGamesPickerProps> = ({
  games,
  selectedGame,
  setSelectedGame,
  required,
}) => {
  const { games: allGames, loading } = useGames();
  // Create a map from ID to readable name
  const gameNameMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    allGames.forEach((g) => {
      map[g.id] = g.name;
      map[g.name] = g.name; // for possible non-UUID storage fallback
    });
    return map;
  }, [allGames]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading games...</div>;
  }

  if (!games || games.length === 0) {
    return (
      <div>
        <Label>No games available for this ground.</Label>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Label htmlFor="booking-game">Select Game{required ? " *" : ""}</Label>
      <Select value={selectedGame} onValueChange={setSelectedGame}>
        <SelectTrigger id="booking-game">
          <SelectValue placeholder="Choose Game" />
        </SelectTrigger>
        <SelectContent>
          {games.map((game) => (
            <SelectItem key={game} value={game}>
              {gameNameMap[game] || game}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BookingGamesPicker;
