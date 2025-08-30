import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import cricket from "/ecom/cricket.png";
import nivia_ball from "/ecom/nivia_ball.png";
import football from "/ecom/football.png";
import tennis from "/ecom/tennis.png";

const ShopPromotionSection = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-16 bg-gradient-to-r from-secondary-600 to-secondary-900  overflow-hidden text-white">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
        <div className="md:w-3/5 mb-8 md:mb-0 md:pr-12">
          <h2 className="text-3xl font-bold mb-4">
            Shop Premium Sports Equipment
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Get high-quality sports equipment delivered right to your door. From
            balls to bats, we've got everything you need for your game.
          </p>
          <Button
            variant="default"
            size="lg"
            className="bg-white text-indigo-700 hover:bg-gray-100"
            onClick={() => navigate("/shop")}
          >
            <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now
          </Button>
        </div>
        <div className="md:w-2/5 flex justify-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="h-24 w-24 bg-white/10 rounded-full mx-auto mb-2">
                <img
                  src={cricket}
                  alt={"Cricket Plastic Bet"}
                  className="h-24 w-24 rounded-full "
                />
              </div>
              <p className="text-center font-medium">Cricket Bats</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="h-24 w-24 bg-white/10 rounded-full mx-auto mb-2">
                <img
                  src={nivia_ball}
                  alt={"FoorBalls"}
                  className="h-24 w-24 rounded-full "
                />
              </div>
              <p className="text-center font-medium">Nivia Tennis Balls</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="h-24 w-24 bg-white/10 rounded-full mx-auto mb-2">
                <img
                  src={tennis}
                  alt={"Tennis"}
                  className="h-24 w-24 rounded-full "
                />
              </div>
              <p className="text-center font-medium">Tennis</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="h-24 w-24 bg-white/10 rounded-full mx-auto mb-2">
                <img
                  src={football}
                  alt={"FoorBalls"}
                  className="h-24 w-24 rounded-full "
                />
              </div>
              <p className="text-center font-medium">Football</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPromotionSection;
