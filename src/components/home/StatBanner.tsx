import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { MapPin, Calendar, Users, Clock } from "lucide-react";

const stats = [
  {
    value: 150,
    label: "Sports Venues",
    icon: <MapPin className="h-5 w-5" />,
    format: (value: number) => value.toLocaleString()
  },
  {
    value: 10000,
    label: "Monthly Bookings", 
    icon: <Calendar className="h-5 w-5" />,
    format: (value: number) => value.toLocaleString()
  },
  {
    value: 30,
    label: "Cities Available",
    icon: <Users className="h-5 w-5" />,
    format: (value: number) => value.toLocaleString()
  },
  {
    value: 24,
    label: "Hours Support",
    icon: <Clock className="h-5 w-5" />,
    format: (value: number) => `${value}h`
  }
];

const StatBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="mb-16">
      <motion.div 
        className="bg-gradient-to-r from-primary-700 to-primary-800 rounded-2xl overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/20 text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {isVisible && (
                    <CountUp 
                      end={stat.value} 
                      decimals={0}
                      delay={0}
                      formattingFn={stat.format}
                    />
                  )}
                </div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatBanner;
