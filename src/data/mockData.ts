
import { Booking, Ground, GroundInventory, InventoryItem, TimeSlot, User } from "@/types/models";

// Mock Users
export const users: User[] = [
  {
    id: "user1",
    name: "John Smith",
    email: "john@example.com",
    phone: "555-123-4567",
    role: "user",
    avatar: "/placeholder.svg",
  },
  {
    id: "admin1",
    name: "David Park",
    email: "david@example.com",
    phone: "555-987-6543",
    role: "admin",
    avatar: "/placeholder.svg",
  },
  {
    id: "super1",
    name: "Admin Super",
    email: "admin@example.com",
    phone: "555-111-2222",
    role: "super_admin",
    avatar: "/placeholder.svg",
  },
];

// Mock Grounds
export const grounds: Ground[] = [
  {
    id: "ground1",
    name: "Green Meadows Football Ground",
    description: "Professional football ground with natural grass and floodlights for night games.",
    address: "123 Sports Avenue, Sportsville",
    location: {
      lat: 18.5204,
      lng: 73.8567,
    },
    ownerId: "admin1",
    ownerName: "David Park",
    ownerContact: "555-987-6543",
    ownerWhatsapp: "555-987-6543",
    games: ["Football", "Rugby"],
    facilities: ["Drinking Water", "Changing Rooms", "Toilet - Ladies", "Toilet - Gents", "Parking", "Floodlights"],
    images: ["/placeholder.svg"],
    rating: 4.5,
    reviewCount: 28,
  },
  {
    id: "ground2",
    name: "Premier Cricket Stadium",
    description: "Cricket ground with well-maintained pitch and practice nets.",
    address: "456 Cricket Lane, Sportsville",
    location: {
      lat: 18.5314,
      lng: 73.8446,
    },
    ownerId: "admin1",
    ownerName: "David Park",
    ownerContact: "555-987-6543",
    ownerWhatsapp: "555-987-6543",
    games: ["Cricket"],
    facilities: ["Drinking Water", "Changing Rooms", "Toilet - Gents", "Cafeteria", "Parking"],
    images: ["/placeholder.svg"],
    rating: 4.2,
    reviewCount: 15,
  },
  {
    id: "ground3",
    name: "Multi-Sports Complex",
    description: "Versatile facility for various sports with modern amenities.",
    address: "789 Athletic Drive, Sportsville",
    location: {
      lat: 18.5642,
      lng: 73.7769,
    },
    ownerId: "admin1",
    ownerName: "David Park",
    ownerContact: "555-987-6543",
    ownerWhatsapp: "555-987-6543",
    games: ["Tennis", "Basketball", "Volleyball", "Badminton"],
    facilities: ["Drinking Water", "Changing Rooms", "Toilet - Ladies", "Toilet - Gents", "Cafeteria", "Parking", "Floodlights", "Equipment Rental"],
    images: ["/placeholder.svg"],
    rating: 4.8,
    reviewCount: 42,
  },
];

// Generate time slots for the next 7 days
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startDate = new Date();
  
  // For each of the next 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = new Date();
    currentDate.setDate(startDate.getDate() + dayOffset);
    const dateString = currentDate.toISOString().split('T')[0];
    
    // For each ground
    grounds.forEach(ground => {
      // Generate slots from 11:00 AM to 6:00 AM next day (19 hours)
      for (let hour = 11; hour < 30; hour++) {
        const startHour = hour % 24;
        const endHour = (hour + 1) % 24;
        
        const startTime = `${startHour.toString().padStart(2, '0')}:00`;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
        
        // Randomly mark some slots as booked
        const isBooked = Math.random() > 0.7;
        
        slots.push({
          id: `slot-${ground.id}-${dateString}-${startTime}`,
          groundId: ground.id,
          startTime,
          endTime,
          date: dateString,
          isBooked,
          price: Math.floor(Math.random() * 300) + 500, // Random price between 500-800
        });
      }
    });
  }
  
  return slots;
};

export const timeSlots = generateTimeSlots();

// Mock Bookings
export const bookings: Booking[] = [
  {
    id: "booking1",
    userId: "user1",
    userName: "John Smith",
    userPhone: "555-123-4567",
    groundId: "ground1",
    groundName: "Green Meadows Football Ground",
    date: "2025-04-12",
    slots: [
      timeSlots.find(slot => slot.id === "slot-ground1-2025-04-12-15:00")!,
      timeSlots.find(slot => slot.id === "slot-ground1-2025-04-12-16:00")!,
    ],
    totalAmount: 1200,
    paymentStatus: "completed",
    bookingStatus: "confirmed",
    createdAt: "2025-04-11T10:30:00Z",
  },
  {
    id: "booking2",
    userId: "user1",
    userName: "John Smith",
    userPhone: "555-123-4567",
    groundId: "ground2",
    groundName: "Premier Cricket Stadium",
    date: "2025-04-13",
    slots: [
      timeSlots.find(slot => slot.id === "slot-ground2-2025-04-13-18:00")!,
      timeSlots.find(slot => slot.id === "slot-ground2-2025-04-13-19:00")!,
    ],
    totalAmount: 1500,
    paymentStatus: "pending",
    bookingStatus: "pending",
    createdAt: "2025-04-11T14:15:00Z",
  },
];

// Mock Inventory Items
export const inventoryItems: InventoryItem[] = [
  {
    id: "item1",
    name: "Tennis Ball (Soft)",
    category: "Tennis",
    price: 150,
    description: "Soft tennis balls for practice",
    image: "/placeholder.svg",
  },
  {
    id: "item2",
    name: "Cricket Bat",
    category: "Cricket",
    price: 1200,
    description: "Professional cricket bat",
    image: "/placeholder.svg",
  },
  {
    id: "item3",
    name: "Football",
    category: "Football",
    price: 800,
    description: "Standard size football",
    image: "/placeholder.svg",
  },
  {
    id: "item4",
    name: "Basketball",
    category: "Basketball",
    price: 700,
    description: "Regulation size basketball",
    image: "/placeholder.svg",
  },
  {
    id: "item5",
    name: "Badminton Racket",
    category: "Badminton",
    price: 500,
    description: "Lightweight badminton racket",
    image: "/placeholder.svg",
  },
  {
    id: "item6",
    name: "Cricket Stumps",
    category: "Cricket",
    price: 900,
    description: "Set of cricket stumps and bails",
    image: "/placeholder.svg",
  },
];

// Mock Ground Inventory
export const groundInventory: GroundInventory[] = [
  {
    groundId: "ground1",
    itemId: "item3",
    quantity: 10,
    itemName: "Football",
    itemPrice: 800,
  },
  {
    groundId: "ground2",
    itemId: "item2",
    quantity: 5,
    itemName: "Cricket Bat",
    itemPrice: 1200,
  },
  {
    groundId: "ground2",
    itemId: "item6",
    quantity: 3,
    itemName: "Cricket Stumps",
    itemPrice: 900,
  },
  {
    groundId: "ground3",
    itemId: "item1",
    quantity: 30,
    itemName: "Tennis Ball (Soft)",
    itemPrice: 150,
  },
  {
    groundId: "ground3",
    itemId: "item4",
    quantity: 8,
    itemName: "Basketball",
    itemPrice: 700,
  },
  {
    groundId: "ground3",
    itemId: "item5",
    quantity: 12,
    itemName: "Badminton Racket",
    itemPrice: 500,
  },
];
