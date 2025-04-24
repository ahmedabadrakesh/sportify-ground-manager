
import { useGames } from './useGames';

export const useGameNames = () => {
  const { games, loading } = useGames();

  const getGameNames = (gameIds: string[]) => {
    if (!games || !gameIds) return [];
    return gameIds.map(id => {
      const game = games.find(g => g.id === id);
      return game ? game.name : '';
    }).filter(Boolean);
  };

  return {
    getGameNames,
    loading
  };
};
