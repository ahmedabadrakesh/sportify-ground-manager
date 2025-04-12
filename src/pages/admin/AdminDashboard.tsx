
import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { bookings, grounds, inventoryItems } from "@/data/mockData";
import { getCurrentUser, hasRole } from "@/utils/auth";

// Import refactored components
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import StatsSection from "@/components/admin/dashboard/StatsSection";
import BookingChart from "@/components/admin/dashboard/BookingChart";
import RecentActivityCard from "@/components/admin/dashboard/RecentActivityCard";

const AdminDashboard: React.FC = () => {
  const currentUser = getCurrentUser();
  const isSuperAdmin = hasRole('super_admin');
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  
  // Filter bookings for ground owner
  const ownerBookings = isSuperAdmin 
    ? bookings 
    : bookings.filter(booking => {
        const ground = grounds.find(g => g.id === booking.groundId);
        return ground?.ownerId === currentUser?.id;
      });
  
  // Get user's grounds
  const userGrounds = isSuperAdmin
    ? grounds
    : grounds.filter(ground => ground.ownerId === currentUser?.id);
  
  // Calculate total revenue
  const totalRevenue = ownerBookings
    .filter(booking => booking.paymentStatus === 'completed')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);
  
  // Calculate pending bookings
  const pendingBookings = ownerBookings.filter(
    booking => booking.bookingStatus === 'pending'
  ).length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
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
    <AdminLayout>
      <DashboardHeader user={currentUser} />

      {/* Stats Cards */}
      <div ref={statsRef}>
        <StatsSection
          bookings={ownerBookings}
          grounds={userGrounds}
          inventoryItems={inventoryItems}
          pendingBookings={pendingBookings}
          totalRevenue={totalRevenue}
          isSuperAdmin={isSuperAdmin}
          statsVisible={statsVisible}
        />
      </div>

      {/* Booking Trends */}
      <div className="mb-8">
        <BookingChart bookings={ownerBookings} />
      </div>

      {/* Recent Activity */}
      <RecentActivityCard bookings={ownerBookings} />
    </AdminLayout>
  );
};

export default AdminDashboard;
