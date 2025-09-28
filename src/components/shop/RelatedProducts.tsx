import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search } from "lucide-react";
import { getAllProducts, searchProducts } from "@/utils/ecommerce";
import { Product } from "@/types/models";
import { addToCart } from "@/utils/cart";
import { toast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import ProductItemCard from "./productItemCard";

const RelatedProducts = ({ currrentCatagory }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>(currrentCatagory);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(true);

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        setProducts(allProducts);

        // Extract unique categories
        const uniqueCategories = new Set<string>();
        allProducts.forEach((product) =>
          uniqueCategories.add(product.category)
        );
        setCategories(["all", ...Array.from(uniqueCategories)]);

        // Apply initial filtering
        applyFilters(allProducts, searchTerm, category, sortBy);
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
  const applyFilters = (
    productsList: Product[],
    search: string,
    cat: string,
    sort: string
  ) => {
    // Filter products
    let filtered = [...productsList];

    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(search.toLowerCase())) ||
          product.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (cat !== "all") {
      filtered = filtered.filter((product) => product.category === cat);
    }

    // Sort products
    filtered.sort((a, b) => {
      if (sort === "featured") {
        return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
      } else if (sort === "priceAsc") {
        return a.price - b.price;
      } else if (sort === "priceDesc") {
        return b.price - a.price;
      }
      return 0;
    });

    setFilteredProducts(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(products, value, category, sortBy);
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    applyFilters(products, searchTerm, value, sortBy);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFilters(products, searchTerm, category, value);
  };

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    const cartItem = await addToCart(product);
    if (cartItem) {
      toast({ title: "Success", description: `${product.name} added to cart` });
    }
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
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/6 md:basis-1/3 lg:basis-1/4"
                >
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
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategory("all");
                  applyFilters(products, "", "all", sortBy);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RelatedProducts;
