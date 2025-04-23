
import { Button } from "@/components/ui/button";
import { Search, Calendar, Check, ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Find a Ground",
      description: "Search for sports grounds based on your location, preferred sport, or venue name."
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Choose Your Location",
      description: "Browse through available venues and select the one that best suits your needs."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Book a Slot",
      description: "Choose from available time slots, select the date and duration that works for you."
    },
    {
      icon: <Check className="h-6 w-6" />,
      title: "Confirm & Play",
      description: "Make the payment securely online and receive instant confirmation. Show up and play!"
    }
  ];
  
  return (
    <div className="mb-16">
      <motion.div
        className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700 relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-14">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              How JOKOVO Works
            </motion.h2>
            <motion.p 
              className="text-white/90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Book your perfect sports venue in just a few easy steps
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 2) }}
              >
                <div className="bg-white rounded-xl p-6 h-full shadow-lg">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 transform z-0 text-primary-400">
                    <ArrowRight className="h-5 w-5" />
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
              className="px-8 bg-white text-primary-700 hover:bg-white/90"
              size="lg"
            >
              Find Your Ground Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HowItWorksSection;
