import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Search } from "lucide-react";
import { getAllProducts, searchProducts } from "@/utils/ecommerce";
import { Product } from "@/types/models";
import { addToCart } from "@/utils/cart";
import { toast } from "@/hooks/use-toast";

const ProductItemCard = ({ productItem }) => {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    const cartItem = await addToCart(product);
    if (cartItem) {
      toast({ title: "Success", description: `${product.name} added to cart` });
    }
  };

  return (
    <Card key={productItem.id} className="overflow-hidden">
      <div className="relative z-10">
        <span className=" absolute right-0 top-4 bg-blue-500 text-blue-800 text-xm font-medium me-2 px-2.5 py-0.5 rounded-sm text-white border">
          ₹{productItem.price}
        </span>
      </div>
      <div
        className="aspect-square relative bg-gray-100 cursor-pointer"
        onClick={() =>
          navigate(
            `/product/${
              productItem.name
                ? productItem.name.toLowerCase().replace(/\s+/g, "-")
                : "product"
            }/${productItem.id}`
          )
        }
      >
        <img
          src={productItem.images?.[0] || "/placeholder.svg"}
          alt={productItem.name}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
        {productItem.featured && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h2
          className="font-semibold text-lg mb-1 cursor-pointer hover:text-primary transition-colors"
          onClick={() =>
            navigate(
              `/product/${
                productItem.name
                  ? productItem.name.toLowerCase().replace(/\s+/g, "-")
                  : "product"
              }/${productItem.id}`
            )
          }
        >
          {`${productItem.name.substring(0, 30)}${
            productItem.name.length > 30 ? "..." : ""
          }`}
        </h2>
      </CardContent>

      <CardFooter className="p-4 pt-0 w-full">
        <Button
          className="flex w-1/2 p-4 mr-2"
          variant="secondary"
          onClick={() => handleAddToCart(productItem)}
          disabled={productItem.stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
        <Button
          className="flex w-1/2 p-4 ml-2"
          variant="outline"
          onClick={() =>
            navigate(
              `/product/${
                productItem.name
                  ? productItem.name.toLowerCase().replace(/\s+/g, "-")
                  : "product"
              }/${productItem.id}`
            )
          }
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductItemCard;
