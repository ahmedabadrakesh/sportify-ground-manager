
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MapPin, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: <Search className="w-10 h-10" />,
      title: "Find a Ground",
      description: "Search for sports grounds based on your location, preferred sport, or venue name."
    },
    {
      icon: <MapPin className="w-10 h-10" />,
      title: "Choose Your Location",
      description: "Browse through available venues and select the one that best suits your needs."
    },
    {
      icon: <Calendar className="w-10 h-10" />,
      title: "Book a Slot",
      description: "Choose from available time slots, select the date and duration that works for you."
    },
    {
      icon: <CheckCircle className="w-10 h-10" />,
      title: "Confirm & Play",
      description: "Make the payment securely online and receive instant confirmation. Show up and play!"
    }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How SportifyGround Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book your perfect sports venue in just a few easy steps
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="group h-full">
                <div className="bg-white rounded-2xl p-8 h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600 transform origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-6 text-primary-600 transition-transform duration-300 transform group-hover:scale-110">
                      {step.icon}
                    </div>
                    
                    <span className="absolute -top-4 -right-4 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                      {index + 1}
                    </span>
                    
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-primary-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            onClick={() => navigate("/search")} 
            size="lg"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Find Your Ground Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
