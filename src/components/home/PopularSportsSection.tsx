
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
  },
  {
    name: "Cricket",
    image: "/lovable-uploads/27625342-e6fd-422e-ae14-de07f6d2b609.png",
    color: "bg-green-100",
  },
  {
    name: "Badminton",
    image: "/lovable-uploads/c12738fc-8bc8-493f-bebb-76f61f0b4153.png",
    color: "bg-pink-100",
  },
  {
    name: "Pickleball",
    image: "/lovable-uploads/4c9a60ba-be0e-403f-b341-6e2c7f5d6f29.png",
    color: "bg-orange-100",
  },
  {
    name: "Tennis",
    image: "/placeholder.svg",
    color: "bg-blue-100",
  },
  {
    name: "Basketball",
    image: "/placeholder.svg",
    color: "bg-purple-100",
  },
];

const PopularSportsSection = () => {
  return (
    <div className="mb-16">
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

