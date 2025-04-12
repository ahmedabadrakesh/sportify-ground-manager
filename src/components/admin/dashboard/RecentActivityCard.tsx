
import React from "react";
import { Booking } from "@/types/models";

interface RecentActivityCardProps {
  bookings: Booking[];
}

// Icon components
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

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ bookings }) => {
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <div className="divide-y">
          {recentBookings.map((booking) => (
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
          
          {recentBookings.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No recent activity to show.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivityCard;
