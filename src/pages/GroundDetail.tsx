
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import GroundHeader from "@/components/grounds/GroundHeader";
import GroundTabs from "@/components/grounds/GroundTabs";
import BookingForm from "@/components/grounds/BookingForm";
import { Ground } from "@/types/models";
import { toast } from "sonner";

const GroundDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ground, setGround] = useState<Ground | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGround = async () => {
      try {
        // In a real app, this would be an API call
        // For demo, we'll simulate API fetch with timeout
        setTimeout(() => {
          import("@/data/mockData").then(({ grounds }) => {
            const foundGround = grounds.find((g) => g.id === id);
            setGround(foundGround || null);
            setLoading(false);
            
            if (!foundGround) {
              toast.error("Ground not found");
            }
          });
        }, 500);
      } catch (error) {
        console.error("Error fetching ground details:", error);
        toast.error("Failed to load ground details");
        setLoading(false);
      }
    };
    
    if (id) {
      fetchGround();
    }
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
      <GroundHeader ground={ground} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <GroundTabs ground={ground} />
        </div>

        <BookingForm ground={ground} />
      </div>
    </MainLayout>
  );
};

export default GroundDetail;
