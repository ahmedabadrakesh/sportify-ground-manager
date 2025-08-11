import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Plus, Minus } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/utils/ecommerce";
import { addToCart } from "@/utils/cart";
import { Product } from "@/types/models";
import { toast } from "sonner";

const ProductDetail: React.FC = () => {
  const { id, name } = useParams<{ id: string; name: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate("/shop");
        return;
      }

      try {
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
        } else {
          toast.error("Product not found");
          navigate("/shop");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product");
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    const cartItem = addToCart(product, quantity);
    if (cartItem) {
      toast.success(`Added ${quantity} ${product.name}(s) to cart`);
    } else {
      toast.error("Failed to add item to cart");
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/shop")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
          </Button>
        </div>
      </MainLayout>
    );
  }

  const mainImage = product.images && product.images.length > 0 
    ? product.images[selectedImageIndex] 
    : "/placeholder.svg";

  const structuredData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images || ["/placeholder.svg"],
    "description": product.description || `High quality ${product.name} available at Jokova Sports Equipment Shop`,
    "brand": {
      "@type": "Brand",
      "name": "Jokova"
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== "undefined" ? window.location.href : "",
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Jokova"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.0",
      "reviewCount": "23"
    }
  } : undefined;

  return (
    <MainLayout>
      <SEOHead
        title={product ? `${product.name} | Buy Sports Equipment | Jokova` : "Product | Jokova"}
        description={product ? `Buy ${product.name} for ₹${product.price}. ${product.description || 'High quality sports equipment with fast delivery.'} ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}.`.substring(0, 160) : "Buy sports equipment and accessories from Jokova's online store."}
        keywords={product ? `${product.name}, ${product.category}, sports equipment, buy online, sports gear, ${product.name.split(' ').join(', ')}` : "sports equipment, sports gear, buy online"}
        canonicalUrl={typeof window !== "undefined" ? window.location.href : ""}
        ogImage={product?.images?.[0] || "/placeholder.svg"}
        ogType="product"
        structuredData={structuredData}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/shop")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? "border-primary" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.featured && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.0) • 23 reviews</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-primary">
              ₹{product.price}
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Availability:</span>
                    <span className={`font-medium ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>

                  {product.stock > 0 && (
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">Quantity:</span>
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="h-10 w-10"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="h-10 w-10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button 
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/cart")}
                      size="lg"
                    >
                      View Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Product Info */}
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Free shipping</span>
                <span>on orders over ₹500</span>
              </div>
              <div className="flex justify-between">
                <span>Return policy</span>
                <span>30 days return</span>
              </div>
              <div className="flex justify-between">
                <span>Customer support</span>
                <span>24/7 available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section - You can implement this later */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="text-center text-gray-500">
            Related products coming soon...
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;