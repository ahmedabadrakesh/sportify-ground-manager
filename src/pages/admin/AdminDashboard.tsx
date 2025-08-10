
import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { bookings, grounds, inventoryItems } from "@/data/mockData";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";

// Import refactored components
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import StatsSection from "@/components/admin/dashboard/StatsSection";
import BookingChart from "@/components/admin/dashboard/BookingChart";
import RecentActivityCard from "@/components/admin/dashboard/RecentActivityCard";
import EcommerceStatsCard from "@/components/admin/dashboard/EcommerceStatsCard";
import { getAllProducts } from "@/utils/ecommerce";

const AdminDashboard: React.FC = () => {
  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync('super_admin');
  const [statsVisible, setStatsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [ecommerceStats, setEcommerceStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    recentOrders: []
  });
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

  // Load e-commerce data
  useEffect(() => {
    const loadEcommerceData = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
        
        // Calculate e-commerce stats
        const lowStock = productsData.filter(p => p.stock <= 5).length;
        
        // Mock order data for demo - replace with real data
        const mockOrders = [
          {
            id: "order-1",
            customerName: "John Doe",
            total: 1250,
            status: "completed",
            date: "Today"
          },
          {
            id: "order-2", 
            customerName: "Jane Smith",
            total: 850,
            status: "pending",
            date: "Yesterday"
          },
          {
            id: "order-3",
            customerName: "Mike Johnson", 
            total: 2100,
            status: "completed",
            date: "2 days ago"
          }
        ];

        setEcommerceStats({
          totalOrders: mockOrders.length,
          totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
          totalProducts: productsData.length,
          lowStockProducts: lowStock,
          recentOrders: mockOrders
        });
      } catch (error) {
        console.error("Error loading e-commerce data:", error);
      }
    };

    loadEcommerceData();
  }, []);

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

      {/* E-commerce Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">E-commerce Overview</h2>
        <EcommerceStatsCard stats={ecommerceStats} />
      </div>

      {/* Recent Activity */}
      <RecentActivityCard bookings={ownerBookings} />
    </AdminLayout>
  );
};

export default AdminDashboard;
