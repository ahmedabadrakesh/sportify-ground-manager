
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: "🔍",
      title: "Find a Ground",
      description: "Search for sports grounds based on your location, preferred sport, or venue name."
    },
    {
      icon: "📍",
      title: "Choose Your Location",
      description: "Browse through available venues and select the one that best suits your needs."
    },
    {
      icon: "📅",
      title: "Book a Slot",
      description: "Choose from available time slots, select the date and duration that works for you."
    },
    {
      icon: "✅",
      title: "Confirm & Play",
      description: "Make the payment securely online and receive instant confirmation. Show up and play!"
    }
  ];
  
  return (
    <div className="mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How SportifyGround Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Book your perfect sports venue in just a few easy steps
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-xl p-6 h-full shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-primary-400">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            onClick={() => navigate("/search")} 
            className="px-8 bg-primary-600 text-white hover:bg-primary-700"
            size="lg"
          >
            Find Your Ground Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
