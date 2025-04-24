
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

const SportsProfessionalsPromotion = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-16">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Find Professional Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white shadow-lg"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full transform translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full transform -translate-x-16 translate-y-16" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Looking for Sports Professional?</h3>
            <p className="mb-6 text-white/90">
              Find experienced coaches, trainers, and athletes for your sports journey
            </p>
            <Button 
              onClick={() => navigate("/sports-professionals")}
              variant="secondary"
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90 font-medium"
            >
              <Search className="mr-2 h-4 w-4" />
              Find Professionals
            </Button>
          </div>
        </motion.div>

        {/* Register Professional Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white shadow-lg"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full transform translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full transform -translate-x-16 translate-y-16" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <UserPlus className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Want to join JOKOVO's Professional Squad?</h3>
            <p className="mb-6 text-white/90">
              Register with us and connect with sports enthusiasts in your area
            </p>
            <Button 
              onClick={() => navigate("/sports-professionals")}
              variant="secondary"
              size="lg"
              className="bg-white text-indigo-700 hover:bg-white/90 font-medium"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register as Professional
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SportsProfessionalsPromotion;
