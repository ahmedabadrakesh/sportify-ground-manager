
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GroundCard from "@/components/grounds/GroundCard";
import { getAvailableGrounds } from "@/utils/booking";

const FeaturedGroundsSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Grounds</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getAvailableGrounds()
          .slice(0, 3)
          .map((ground) => (
            <GroundCard key={ground.id} ground={ground} />
          ))}
      </div>

      <div className="text-center mt-8">
        <Button
          variant="outline"
          onClick={() => navigate("/search")}
          className="px-8"
        >
          View All Grounds
        </Button>
      </div>
    </div>
  );
};

export default FeaturedGroundsSection;
