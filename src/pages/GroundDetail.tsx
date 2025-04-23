
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import GroundHeader from "@/components/grounds/GroundHeader";
import GroundInfo from "@/components/grounds/GroundInfo";
import BookingForm from "@/components/grounds/BookingForm";
import { fetchGroundById } from "@/services/groundsService";
import { Ground } from "@/types/models";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const GroundDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ground, setGround] = useState<Ground | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadGroundDetails = async () => {
      try {
        if (!id) {
          setLoading(false);
          return;
        }
        
        const groundData = await fetchGroundById(id);
        setGround(groundData);
      } catch (error) {
        console.error("Error fetching ground details:", error);
        toast.error("Failed to load ground details");
      } finally {
        setLoading(false);
      }
    };
    
    loadGroundDetails();
  }, [id]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">Loading ground details...</p>
        </div>
      </MainLayout>
    );
  }
  
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <GroundHeader ground={ground} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GroundInfo ground={ground} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="w-full" size="lg">
                    Book Now
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
                  <BookingForm ground={ground} />
                </SheetContent>
              </Sheet>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
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
      </div>
    </MainLayout>
  );
};

export default GroundDetail;
