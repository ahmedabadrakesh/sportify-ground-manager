
import { Button } from "@/components/ui/button";
import { Search, Calendar, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorksSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-16 py-12 bg-gray-50 rounded-xl">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Find a Ground</h3>
            <p className="text-gray-600">
              Search for sports grounds based on your location, preferred sport, or venue name.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Book a Slot</h3>
            <p className="text-gray-600">
              Choose from available time slots, select the date and duration that works for you.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Confirm & Play</h3>
            <p className="text-gray-600">
              Make the payment securely online and receive instant confirmation. Show up and play!
            </p>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button onClick={() => navigate("/search")} className="px-8">
            Book Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
