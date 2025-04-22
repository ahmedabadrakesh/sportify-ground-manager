
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GroundCard from "@/components/grounds/GroundCard";
import { getAvailableGrounds } from "@/utils/booking";
import { Ground } from "@/types/models";
import { motion } from "framer-motion";
import { useGames } from "@/hooks/useGames";

const FeaturedGroundsSection = () => {
  const navigate = useNavigate();
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const { games, loading: gamesLoading } = useGames();

  useEffect(() => {
    const loadFeaturedGrounds = async () => {
      try {
        setLoading(true);
        const allGrounds = await getAvailableGrounds();
        setGrounds(allGrounds.slice(0, 3));
      } catch (error) {
        console.error("Error loading featured grounds:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedGrounds();
  }, []);

  const getGameNames = (gameIds: string[]) => {
    return gameIds
      .map(id => {
        const game = games.find(g => g.id === id);
        return game ? game.name : id;
      })
      .filter(Boolean);
  };

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Featured Grounds</h2>
          <p className="text-gray-600 mt-1">Top-rated venues recommended for you</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => navigate("/search")}
            className="border-primary-200 text-primary-700 hover:bg-primary-50 mt-2 md:mt-0"
          >
            View All Grounds
          </Button>
        </motion.div>
      </div>

      {loading || gamesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 rounded-md h-64 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grounds.map((ground, index) => (
            <motion.div
              key={ground.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GroundCard ground={{ ...ground, games: getGameNames(ground.games) }} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <p className="text-gray-600 mb-4">Looking for more options? Explore all venues in your area.</p>
        <Button
          onClick={() => navigate("/search")}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8"
          size="lg"
        >
          Find All Grounds
        </Button>
      </div>
    </div>
  );
};

export default FeaturedGroundsSection;
