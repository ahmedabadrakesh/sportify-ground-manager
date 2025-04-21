
import React from "react";
import { Button } from "@/components/ui/button";

interface Game {
  id: string;
  name: string;
}

interface GamesPickerProps {
  games: Game[];
  selectedGames: string[];
  onToggle: (gameId: string) => void;
  loading?: boolean;
}

const GamesPicker: React.FC<GamesPickerProps> = ({
  games,
  selectedGames,
  onToggle,
  loading,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Select Games</label>
      {loading ? (
        <p className="text-sm text-gray-500">Loading games...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {games.length > 0 ? (
            games.map((game) => (
              <Button
                key={game.id}
                type="button"
                variant={selectedGames.includes(game.id) ? "default" : "outline"}
                className="text-xs px-3 py-1 rounded-full"
                onClick={() => onToggle(game.id)}
              >
                {game.name}
              </Button>
            ))
          ) : (
            <span className="text-xs text-gray-500">No games available</span>
          )}
        </div>
      )}
    </div>
  );
};

export default GamesPicker;
