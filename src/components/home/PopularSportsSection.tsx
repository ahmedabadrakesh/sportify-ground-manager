
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

const sports = [
  {
    name: "Football",
    image: "/game-icons/football.svg",
    color: "bg-amber-100",
  },
  {
    name: "Cricket",
    //image: "/lovable-uploads/27625342-e6fd-422e-ae14-de07f6d2b609.png",
    image: "/game-icons/cricket.svg",
    color: "bg-green-100",
  },
  {
    name: "Badminton",
    image: "/game-icons/badminton.svg",
    color: "bg-pink-100",
  },
  {
    name: "Pickleball",
    image: "/game-icons/pickleball.svg",
    color: "bg-orange-100",
  },
  {
    name: "Basketball",
    image: "/game-icons/basketball.svg",
    color: "bg-purple-100",
  },
  {
    name: "Chess",
    image: "/game-icons/chess.svg",
    color: "bg-purple-100",
  },
  {
    name: "Swimming",
    image: "/game-icons/swimming.svg",
    color: "bg-purple-100",
  },
  {
    name: "Table-Tennis",
    image: "/game-icons/tabletennis.svg",
    color: "bg-purple-100",
  },
];

const PopularSportsSection = () => {
  const navigate = useNavigate();

  const handleSportClick = (sportName: string) => {
    navigate(
      `/sports-professionals?sport=${encodeURIComponent(
        sportName.toLowerCase()
      )}`
    );
  };

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-6 md:mb-0">
        Discover Experts in Your Favorite Sport Find inspiration
      </h2>
      <p className="mb-6 hidden md:block">
        learn from their experiences, and connect with like-minded enthusiasts.
        What's your favorite sport?
      </p>
      <div className="relative px-4">
        <Carousel
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {sports.map((sport, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-1/2 sm:basis-1/6 md:basis-1/3 lg:basis-1/6"
              >
                <motion.div
                  className="cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleSportClick(sport.name)}
                >
                  <div className={`relative ${sport.color} overflow-hidden`}>
                    <img
                      src={sport.image}
                      alt={sport.name}
                      className="w-full h-auto object-cover object-center"
                    />
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default PopularSportsSection;
