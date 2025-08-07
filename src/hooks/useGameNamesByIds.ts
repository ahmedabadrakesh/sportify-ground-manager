import { useGames } from './useGames';

export const useGameNamesByIds = () => {
  const { games, loading } = useGames();

  const getGameNamesByIds = (gameIds: string[] | null | undefined) => {
    if (!games || !gameIds) return [];
    return gameIds.map(id => {
      const game = games.find(g => g.id === id);
      return game ? game.name : '';
    }).filter(Boolean);
  };

  const getFirstGameName = (gameIds: string[] | null | undefined) => {
    const names = getGameNamesByIds(gameIds);
    return names.length > 0 ? names[0] : '';
  };

  return {
    getGameNamesByIds,
    getFirstGameName,
    loading
  };
};