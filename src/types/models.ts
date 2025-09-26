
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  purchasePrice?: number;
  purchaseQuantity?: number;
  availableQuantity?: number;
  description?: string;
  image?: string;
  brandId?: number;
  gamesId?: string[];
  size?: string;
  color?: string;
}

export interface GroundInventory {
  groundId: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  purchasedQuantity?: number;
}

export interface Ground {
  id: string;
  name: string;
  description: string;
  address: string;
  location: { lat: number; lng: number };
  ownerId: string;
  ownerName: string;
  ownerContact: string;
  ownerWhatsapp: string;
  games: string[];
  facilities: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  sportsAreas?: { id: string; name: string }[];
}

export interface Booking {
  id: string;
  userId: string;
  groundId: string;
  date: string;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt?: string;
  sportsAreaId?: string;
  gameIds?: string[];
  userName?: string;
  userPhone?: string;
  groundName?: string;
  slots?: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  groundId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  isBooked: boolean;
  sportsAreaId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authId?: string;
  avatar?: string;
}

export type UserRole = 'user' | 'sports_professional' | 'admin' | 'super_admin' | 'ground_owner';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Event {
  id: string;
  eventName: string;
  address: string;
  city: string;
  location?: { lat: number; lng: number };
  eventDate: string;
  eventTime: string;
  registrationUrl?: string;
  sportId?: string;
  sportName?: string;
  image?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt?: string;
}
