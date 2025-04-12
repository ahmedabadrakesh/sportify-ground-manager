
import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Users, MapPin, PackageIcon } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookings, grounds, inventoryItems } from "@/data/mockData";
import { getCurrentUser, hasRole } from "@/utils/auth";
import CountUp from "react-countup";
import { getAnimationDuration } from "@/utils/stats";

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
  
  // Prepare chart data - bookings by day
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  const bookingsByDay = last7Days.map(date => {
    const count = ownerBookings.filter(booking => booking.date === date).length;
    return {
      date,
      bookings: count,
    };
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {currentUser?.name}! Here's what's happening with your grounds.
        </p>
      </div>

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold mb-1">
                {statsVisible ? (
                  <CountUp 
                    start={0} 
                    end={ownerBookings.length} 
                    duration={getAnimationDuration(ownerBookings.length)} 
                  />
                ) : (
                  0
                )}
              </div>
              <div className="text-sm px-3 py-0.5 bg-gray-100 rounded-full mb-1">Total Bookings</div>
              <p className="text-xs text-gray-500">
                +{statsVisible ? (
                  <CountUp start={0} end={pendingBookings} duration={1.5} />
                ) : (
                  0
                )} pending
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3">
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
              </div>
              <div className="text-2xl font-bold mb-1">
                ₹{statsVisible ? (
                  <CountUp 
                    start={0} 
                    end={totalRevenue} 
                    duration={getAnimationDuration(totalRevenue)} 
                  />
                ) : (
                  0
                )}
              </div>
              <div className="text-sm px-3 py-0.5 bg-gray-100 rounded-full mb-1">Revenue</div>
              <p className="text-xs text-gray-500">
                Completed bookings
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold mb-1">
                {statsVisible ? (
                  <CountUp 
                    start={0} 
                    end={userGrounds.length} 
                    duration={getAnimationDuration(userGrounds.length)} 
                  />
                ) : (
                  0
                )}
              </div>
              <div className="text-sm px-3 py-0.5 bg-gray-100 rounded-full mb-1">
                {isSuperAdmin ? 'Total Grounds' : 'Your Grounds'}
              </div>
              <p className="text-xs text-gray-500">
                {isSuperAdmin ? 'All owners' : 'Your management'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3">
                <PackageIcon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold mb-1">
                {statsVisible ? (
                  <CountUp 
                    start={0} 
                    end={inventoryItems.length} 
                    duration={getAnimationDuration(inventoryItems.length)} 
                  />
                ) : (
                  0
                )}
              </div>
              <div className="text-sm px-3 py-0.5 bg-gray-100 rounded-full mb-1">
                {isSuperAdmin ? 'Inventory' : 'Your Inventory'}
              </div>
              <p className="text-xs text-gray-500">
                {isSuperAdmin ? 'For allocation' : 'Across grounds'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Trends */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [`${value} bookings`, 'Bookings']}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
                    }}
                  />
                  <Bar dataKey="bookings" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
          <div className="divide-y">
            {ownerBookings.slice(0, 5).map((booking, i) => (
              <div key={booking.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                      booking.bookingStatus === 'confirmed'
                        ? 'bg-green-100 text-green-600'
                        : booking.bookingStatus === 'cancelled'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {booking.bookingStatus === 'confirmed' ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : booking.bookingStatus === 'cancelled' ? (
                      <CrossIcon className="h-5 w-5" />
                    ) : (
                      <ClockIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.bookingStatus === 'confirmed'
                        ? 'New Booking Confirmed'
                        : booking.bookingStatus === 'cancelled'
                        ? 'Booking Cancelled'
                        : 'New Booking Request'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.userName} ({booking.userPhone}) booked{' '}
                      {booking.groundName} for {booking.date}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(booking.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {ownerBookings.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No recent activity to show.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CrossIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default AdminDashboard;
