
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { MapPin, Calendar, Users } from "lucide-react";
import { getRegisteredGroundsCount, getBookingsCount, getCitiesCovered, getAnimationDuration } from "@/utils/stats";

const StatisticsSection = () => {
  const [stats, setStats] = useState({
    grounds: 0,
    bookings: 0,
    cities: 0
  });
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStats({
      grounds: getRegisteredGroundsCount(),
      bookings: getBookingsCount(),
      cities: getCitiesCovered().length
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
        } else {
          setStatsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <div ref={statsRef} className="bg-primary-800 text-white py-8 mb-8 rounded-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatItem 
            icon={<MapPin className="h-8 w-8" />} 
            value={stats.grounds} 
            label="Grounds" 
            subtitle="Registered" 
            isVisible={statsVisible} 
          />
          
          <StatItem 
            icon={<Calendar className="h-8 w-8" />} 
            value={stats.bookings} 
            label="Bookings" 
            subtitle="Completed" 
            isVisible={statsVisible} 
          />
          
          <StatItem 
            icon={<Users className="h-8 w-8" />} 
            value={stats.cities} 
            label="Cities" 
            subtitle="Covered" 
            isVisible={statsVisible} 
          />
        </div>
      </div>
    </div>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  subtitle: string;
  isVisible: boolean;
}

const StatItem = ({ icon, value, label, subtitle, isVisible }: StatItemProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
          {icon}
        </div>
        <div className="text-3xl font-bold mb-1">
          {isVisible ? (
            <CountUp 
              start={0} 
              end={value} 
              duration={getAnimationDuration(value)} 
            />
          ) : (
            0
          )}
        </div>
        <div className="text-sm px-3 py-1 bg-white/20 rounded-full mb-1">{label}</div>
        <span className="text-xs opacity-75">{subtitle}</span>
      </div>
    </div>
  );
};

export default StatisticsSection;
