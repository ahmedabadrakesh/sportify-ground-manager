
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getClientReviews } from "@/utils/reviews";
import { useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";

const TestimonialsSection = () => {
  const reviews = getClientReviews();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Group reviews into slides - 2 for desktop, 1 for mobile
  const groupedReviews = [];
  for (let i = 0; i < reviews.length; i += 2) {
    groupedReviews.push(reviews.slice(i, i + 2));
  }

  const handleDotClick = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Clients Say</h2>
      
      <div className="relative">
        <Carousel
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {groupedReviews.map((reviewGroup, slideIndex) => (
              <CarouselItem key={slideIndex}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {reviewGroup.map((review, reviewIndex) => (
                    <Card key={review.id} className="overflow-hidden border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{review.rating}/5</span>
                        </div>
                        <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                            {review.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{review.name}</p>
                            <p className="text-sm text-gray-500">{review.location}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {/* Show empty space if only one review in group on desktop */}
                  {reviewGroup.length === 1 && (
                    <div className="hidden lg:block"></div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index + 1 === current 
                  ? 'bg-primary-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
