
import { grounds, bookings } from "@/data/mockData";

export const getRegisteredGroundsCount = (): number => {
  return grounds.length;
};

export const getBookingsCount = (): number => {
  return bookings.length;
};

export const getCitiesCovered = (): string[] => {
  // Extract unique cities from ground addresses
  const cities = grounds.map(ground => {
    const addressParts = ground.address.split(',');
    return addressParts[addressParts.length - 1].trim();
  });
  
  // Return unique cities
  return [...new Set(cities)];
};

export const getAnimationDuration = (value: number): number => {
  // Adjust duration based on number size for better visual effect
  if (value < 10) return 1;
  if (value < 100) return 2;
  return 2.5;
};
