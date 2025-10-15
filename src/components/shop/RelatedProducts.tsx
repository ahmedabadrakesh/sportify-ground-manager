import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAllProducts, searchProducts } from "@/utils/ecommerce";
import { Product } from "@/types/models";
import { toast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import ProductItemCard from "./ProductItemCard";

const RelatedProducts = ({ currrentCatagory, currentGameIds }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>(currrentCatagory);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        // Apply initial filtering
        applyFilters(allProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Apply filtering and sorting
  const applyFilters = (productsList: Product[]) => {
    // Filter products
    let filtered = [...productsList];

    filtered = filtered.filter((product) =>
      product.gamesId.some((gamesId) => currentGameIds.includes(gamesId))
    );

    setFilteredProducts(filtered);
  };

  return (
    <div className="container mb-8">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 8].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-md h-80 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {filteredProducts.map((product, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/4">
                  <motion.div
                    className="cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  ></motion.div>
                  <ProductItemCard productItem={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div>
              <CarouselPrevious className="-left-10" />
              <CarouselNext className="-right-10" />
            </div>
          </Carousel>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                No products found matching your criteria.
              </p>
              <Button variant="outline" onClick={() => navigate("/shop")}>
                Goto Shop
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RelatedProducts;
