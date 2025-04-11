
interface ClientReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  location: string;
  date: string;
}

// Sample client reviews
const clientReviews: ClientReview[] = [
  {
    id: "review1",
    name: "Rahul Sharma",
    rating: 5,
    comment: "Fantastic grounds! The booking process was super smooth and the facilities were excellent.",
    location: "Mumbai",
    date: "2025-03-15",
  },
  {
    id: "review2",
    name: "Priya Patel",
    rating: 4,
    comment: "Great experience overall. The ground was well-maintained and the staff was helpful.",
    location: "Delhi",
    date: "2025-03-10",
  },
  {
    id: "review3",
    name: "Amit Singh",
    rating: 5,
    comment: "Best cricket ground in the city! Clean facilities and excellent lighting for night games.",
    location: "Bangalore",
    date: "2025-03-05",
  },
  {
    id: "review4",
    name: "Sneha Verma",
    rating: 4,
    comment: "Very convenient booking system. The ground was perfect for our corporate event.",
    location: "Chennai",
    date: "2025-02-28",
  },
  {
    id: "review5",
    name: "Karan Malhotra",
    rating: 5,
    comment: "Amazing football turf! The quality of the grass was top-notch. Will definitely book again.",
    location: "Hyderabad",
    date: "2025-02-20",
  },
  {
    id: "review6",
    name: "Neha Khanna",
    rating: 4,
    comment: "Loved the tennis court. It was well-maintained and the booking process was hassle-free.",
    location: "Pune",
    date: "2025-02-15",
  }
];

export const getClientReviews = (): ClientReview[] => {
  return clientReviews;
};
