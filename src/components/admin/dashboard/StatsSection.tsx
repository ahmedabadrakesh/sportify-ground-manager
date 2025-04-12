
import React from "react";
import { Calendar, Users, MapPin, PackageIcon } from "lucide-react";
import StatCard from "./StatCard";
import { Booking, Ground, InventoryItem } from "@/types/models";
import { CountUp } from "react-countup";

interface StatsSectionProps {
  bookings: Booking[];
  grounds: Ground[];
  inventoryItems: InventoryItem[];
  pendingBookings: number;
  totalRevenue: number;
  isSuperAdmin: boolean;
  statsVisible: boolean;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  bookings,
  grounds,
  inventoryItems,
  pendingBookings,
  totalRevenue,
  isSuperAdmin,
  statsVisible
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<Calendar className="h-6 w-6" />}
        value={bookings.length}
        label="Total Bookings"
        subLabel={`+${pendingBookings} pending`}
        statsVisible={statsVisible}
      />

      <StatCard
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
        value={totalRevenue}
        label="Revenue"
        subLabel="Completed bookings"
        statsVisible={statsVisible}
      />

      <StatCard
        icon={<MapPin className="h-6 w-6" />}
        value={grounds.length}
        label={isSuperAdmin ? 'Total Grounds' : 'Your Grounds'}
        subLabel={isSuperAdmin ? 'All owners' : 'Your management'}
        statsVisible={statsVisible}
      />

      <StatCard
        icon={<PackageIcon className="h-6 w-6" />}
        value={inventoryItems.length}
        label={isSuperAdmin ? 'Inventory' : 'Your Inventory'}
        subLabel={isSuperAdmin ? 'For allocation' : 'Across grounds'}
        statsVisible={statsVisible}
      />
    </div>
  );
};

export default StatsSection;
