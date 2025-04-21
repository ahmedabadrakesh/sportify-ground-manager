
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface BookingGamesPickerProps {
  games: string[];
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
        <SelectTrigger id="booking-game" required={required}>
          <SelectValue placeholder="Choose Game" />
        </SelectTrigger>
        <SelectContent>
          {games.map((game) => (
            <SelectItem key={game} value={game}>
              {game}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BookingGamesPicker;

