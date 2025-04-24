
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ShopPromotionSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-16 rounded-xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 mb-8 md:mb-0 md:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Shop Premium Sports Equipment</h2>
              <p className="text-lg opacity-90 mb-6">
                Get high-quality sports equipment delivered right to your door. From balls to bats, we've got everything you need for your game.
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-blue-700 hover:bg-gray-100 rounded-full px-8 shadow-md"
                onClick={() => navigate("/shop")}
              >
                <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          <motion.div 
            className="md:w-2/5 flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-4">
              {["Cricket Bats", "Footballs", "Tennis Rackets", "Sports Attire"].map((item, index) => (
                <motion.div 
                  key={item}
                  className="bg-white/20 p-4 rounded-lg backdrop-blur-sm"
                  whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-24 w-24 bg-white/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-white/70" />
                  </div>
                  <p className="text-center font-medium">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShopPromotionSection;
