import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import allsports from "/allsports.png";

const SportsProfessionalsPromotion = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-16">
      <div className="grid gap-6">
        {/* Find Professional Section */}
        {/* <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
          <div className="relative z-10">
            <Search className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Looking for Sports Professional?
            </h3>
            <p className="mb-6 text-white/90">
              Find experienced coaches and trainers for your sports journey.
            </p>
            <Button
              onClick={() => navigate("/sports-professionals")}
              variant="secondary"
              className="bg-white text-primary-700 hover:bg-white/90"
            >
              <Search className="mr-2 h-4 w-4" />
              Find Professionals
            </Button>
          </div>
        </motion.div> */}

        {/* Register Professional Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative overflow-hidden bg-gradient-to-br from-secondary-600 to-secondary-800 p-8 text-white"
        >
          <div className="flex-row md:flex gap-6">
            <div className="w-full md:w-1/2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
              {/* <UserPlus className="w-12 h-12 mb-4" /> */}
              <img
                src={allsports}
                alt={"all Sports"}
                className="w-full h-auto object-cover object-center"
              />
            </div>
            <div className="flex-grow content-center md:text-left">
              <div className="relative z-10 ">
                <h3 className="text-2xl font-bold mb-4">
                  Want to join JOKOVO's Professional Squad?
                </h3>
                <p className="mb-6 text-white/90">
                  Register with us and connect with sports enthusiasts in your
                  area
                </p>
                <Button
                  onClick={() => navigate("/sports-professionals")}
                  variant="secondary"
                  className="bg-white text-secondary-700 hover:bg-white/90"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register as Professional
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SportsProfessionalsPromotion;
