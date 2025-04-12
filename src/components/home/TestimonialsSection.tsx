
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getClientReviews } from "@/utils/reviews";

const TestimonialsSection = () => {
  const reviews = getClientReviews();
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Clients Say</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
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
      </div>
    </div>
  );
};

export default TestimonialsSection;
