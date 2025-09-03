import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGames } from "@/hooks/useGames";

// const sports = [
//   {
//     name: "Football",
//     image: "/game-icons/football.svg",
//     color: "bg-amber-100",
//   },
//   {
//     name: "Cricket",
//     //image: "/lovable-uploads/27625342-e6fd-422e-ae14-de07f6d2b609.png",
//     image: "/game-icons/cricket.svg",
//     color: "bg-green-100",
//   },
//   {
//     name: "Badminton",
//     image: "/game-icons/badminton.svg",
//     color: "bg-pink-100",
//   },
//   {
//     name: "Pickleball",
//     image: "/game-icons/pickleball.svg",
//     color: "bg-orange-100",
//   },
//   {
//     name: "Basketball",
//     image: "/game-icons/basketball.svg",
//     color: "bg-purple-100",
//   },
//   {
//     name: "Chess",
//     image: "/game-icons/chess.svg",
//     color: "bg-purple-100",
//   },
//   {
//     name: "Swimming",
//     image: "/game-icons/swimming.svg",
//     color: "bg-purple-100",
//   },
//   {
//     name: "Table-Tennis",
//     image: "/game-icons/tabletennis.svg",
//     color: "bg-purple-100",
//   },
// ];

const PopularSportsSection = () => {
  const navigate = useNavigate();

  const { games } = useGames();

  // Fallback sports with static images
  const fallbackSports = [
    { name: "Football", image: "/game-icons/football.svg" },
    { name: "Cricket", image: "/game-icons/cricket.svg" },
    { name: "Badminton", image: "/game-icons/badminton.svg" },
    { name: "Basketball", image: "/game-icons/basketball.svg" },
    { name: "Chess", image: "/game-icons/chess.svg" },
    { name: "Swimming", image: "/game-icons/swimming.svg" },
  ];

  const sports = games; // Use fallback sports for now

  const handleSportClick = (sportName: string) => {
    navigate(
      `/sports-professionals?sport=${encodeURIComponent(
        sportName.toLowerCase()
      )}`
    );
  };

  return (
    <div className="container mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-6 md:mb-0">
        LOVE A SPORT?
      </h2>
      <p className="text-xl mb-6 hidden md:block">
        Learn from their experiences. Select your favorite sport.
      </p>
      <div className="relative px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {sports.map(
              (sport, index) =>
                sport.popular_game && (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:pl-4 basis-1/2 sm:basis-1/6 md:basis-1/3 lg:basis-1/5"
                  >
                    <motion.div
                      className="cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                      whileHover={{ scale: 1.03 }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => handleSportClick(sport.name)}
                    >
                      <div className={`relative bg-amber-100 overflow-hidden`}>
                        <img
                          src={sport.game_images}
                          alt={sport.name}
                          className="w-full h-auto object-cover object-center"
                        />
                      </div>
                    </motion.div>
                  </CarouselItem>
                )
            )}
          </CarouselContent>
          <div>
            <CarouselPrevious className="-left-10" />
            <CarouselNext className="-right-10" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default PopularSportsSection;
