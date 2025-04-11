
export type UserRole = 'user' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Ground {
  id: string;
  name: string;
  description: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  ownerId: string;
  ownerName: string;
  ownerContact: string;
  ownerWhatsapp: string;
  games: string[];
  facilities: string[];
  images: string[];
  rating?: number;
  reviewCount?: number;
}

export interface TimeSlot {
  id: string;
  groundId: string;
  startTime: string; // Format: HH:MM in 24-hour
  endTime: string; // Format: HH:MM in 24-hour
  date: string; // Format: YYYY-MM-DD
  isBooked: boolean;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  groundId: string;
  groundName: string;
  date: string; // Format: YYYY-MM-DD
  slots: TimeSlot[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'cancelled';
  bookingStatus: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
}

export interface GroundInventory {
  groundId: string;
  itemId: string;
  quantity: number;
  itemName: string;
  itemPrice: number;
}
