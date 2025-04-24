
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

const sports = [
  {
    name: "Football",
    image: "/lovable-uploads/bd819b5a-d48f-4871-9ecb-2686db70f38b.png",
    color: "bg-amber-100",
    textColor: "text-amber-800"
  },
  {
    name: "Cricket",
    image: "/lovable-uploads/27625342-e6fd-422e-ae14-de07f6d2b609.png",
    color: "bg-green-100",
    textColor: "text-green-800"
  },
  {
    name: "Badminton",
    image: "/lovable-uploads/c12738fc-8bc8-493f-bebb-76f61f0b4153.png",
    color: "bg-pink-100",
    textColor: "text-pink-800"
  },
  {
    name: "Pickleball",
    image: "/lovable-uploads/4c9a60ba-be0e-403f-b341-6e2c7f5d6f29.png",
    color: "bg-orange-100",
    textColor: "text-orange-800"
  },
  {
    name: "Tennis",
    image: "/placeholder.svg",
    color: "bg-blue-100",
    textColor: "text-blue-800"
  },
  {
    name: "Basketball",
    image: "/placeholder.svg",
    color: "bg-purple-100",
    textColor: "text-purple-800"
  },
];

const PopularSportsSection = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12"> {/* Increased bottom margin */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Popular Sports</h2>
          <p className="text-gray-600 mt-1">Find the perfect venue for your favorite sport</p>
        </motion.div>
        
        <motion.button
          className="text-primary-600 font-medium flex items-center mt-2 md:mt-0 hover:text-primary-700 transition-colors"
          onClick={() => navigate("/search")}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          View All Sports <span className="ml-1">→</span>
        </motion.button>
      </div>

      <div className="relative px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {sports.map((sport, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <motion.div
                  className="cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => navigate(`/search?sport=${sport.name}`)}
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`relative aspect-[4/5] ${sport.color} overflow-hidden`}>
                    <img 
                      src={sport.image} 
                      alt={sport.name}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Removed text overlay div */}
                    {/* Removed the gradient overlay as well to fully hide the text */}
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default PopularSportsSection;
