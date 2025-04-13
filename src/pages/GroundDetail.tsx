
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, Phone, MessageSquare, Star } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { getAvailableGrounds, getAvailableTimeSlots, createBooking } from "@/utils/booking";
import { isAuthenticated } from "@/utils/auth";
import { toast } from "sonner";

const GroundDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ground = getAvailableGrounds().find((g) => g.id === id);
  
  const [date, setDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  
  if (!ground) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ground Not Found</h1>
          <p className="text-gray-600 mb-6">
            The ground you are looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/search")}>Browse All Grounds</Button>
        </div>
      </MainLayout>
    );
  }
  
  // Get the correct image path for display
  const imagePath = ground.images[0] || "/placeholder.svg";
  // Remove the "public/" prefix if it exists (for correct browser display)
  const displayImagePath = imagePath.startsWith("public/") ? imagePath.substring(7) : imagePath;
  
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const availableSlots = getAvailableTimeSlots(ground.id, formattedDate);
  
  const handleSelectSlot = (slotId: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };
  
  const handleBookNow = () => {
    if (!isAuthenticated() && (!name || !phone)) {
      toast.error("Please enter your name and phone number");
      return;
    }
    
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }
    
    const newBooking = createBooking(
      ground.id,
      formattedDate,
      selectedSlots,
      name,
      phone
    );
    
    if (newBooking) {
      setBookingStep(2);
    } else {
      toast.error("Failed to create booking. Please try again.");
    }
  };
  
  const handleCompleteBooking = () => {
    toast.success("Booking confirmed! Payment completed successfully.");
    setIsDialogOpen(false);
    setSelectedSlots([]);
    setBookingStep(1);
    navigate("/bookings");
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="aspect-[3/1] overflow-hidden relative">
          <img
            src={displayImagePath}
            alt={ground.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{ground.name}</h1>
            <div className="flex items-center text-sm">
              <MapPin size={16} className="mr-1" />
              <span>{ground.address}</span>
              {ground.rating && (
                <div className="ml-4 flex items-center">
                  <Star size={16} className="text-yellow-400 mr-1" />
                  <span>
                    {ground.rating.toFixed(1)} ({ground.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{ground.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Available Sports</h2>
                <div className="flex flex-wrap gap-2">
                  {ground.games.map((game) => (
                    <Badge key={game} variant="secondary" className="text-sm py-1">
                      {game}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="facilities" className="space-y-6">
              <h2 className="text-xl font-semibold mb-3">Facilities & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ground.facilities.map((facility) => (
                  <div key={facility} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-6">
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone size={20} className="text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-700">{ground.ownerContact}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MessageSquare size={20} className="text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-gray-700">{ground.ownerWhatsapp}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-700">{ground.address}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4">Book This Ground</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="date" className="block mb-2 text-gray-700">
                Select Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label className="block mb-2 text-gray-700">
                Available Time Slots
              </Label>
              <div className="text-sm text-gray-500 mb-2 flex items-center">
                <Clock size={14} className="mr-1" />
                <span>
                  Each slot is for 1 hour. Select multiple slots if needed.
                </span>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">View Available Slots</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {bookingStep === 1
                        ? `Book ${ground.name} - ${date ? format(date, "PPP") : "Select a Date"}`
                        : "Complete Your Booking"}
                    </DialogTitle>
                  </DialogHeader>
                  
                  {bookingStep === 1 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="booking-name">Your Name</Label>
                          <Input
                            id="booking-name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="booking-phone">Phone Number</Label>
                          <Input
                            id="booking-phone"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <TimeSlotPicker
                        slots={availableSlots}
                        selectedSlots={selectedSlots}
                        onSelectSlot={handleSelectSlot}
                      />
                      
                      <div className="flex justify-end">
                        <Button onClick={handleBookNow}>
                          Proceed to Payment
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-lg mb-3">Booking Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ground:</span>
                            <span className="font-medium">{ground.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">
                              {date ? format(date, "PPP") : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Slots:</span>
                            <span className="font-medium">
                              {selectedSlots.length} slots
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-bold text-primary-700">
                              ₹{selectedSlots.length * 800}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-lg mb-3">Payment Details</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input
                              id="card-number"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="123" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setBookingStep(1)}>
                          Back
                        </Button>
                        <Button onClick={handleCompleteBooking}>
                          Complete Booking
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Price per hour:</span>
                <span className="font-semibold">₹500 - ₹800</span>
              </div>
              <p className="text-xs text-gray-500">
                *Prices may vary based on time slot and day of the week
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GroundDetail;
