
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ShoppingBag, CreditCard, Truck, Check, ArrowLeft, Loader2 } from "lucide-react";
import { getCart, getCartTotal, processCheckout } from "@/utils/cart";
import { CartItem } from "@/types/models";
import { products } from "@/data/mockData";
import { getCurrentUserSync } from "@/utils/auth";

const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(10, { message: "Please enter your complete address" }),
  paymentMethod: z.enum(["card", "cod"], { 
    required_error: "Please select a payment method" 
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const currentUser = getCurrentUserSync();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: "",
      paymentMethod: "card",
    },
  });

  useEffect(() => {
    const cartItems = getCart();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }
    setCart(cartItems);
    setLoading(false);
  }, [navigate]);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { 
      ...item, 
      product,
      subtotal: product ? product.price * item.quantity : 0
    };
  }).filter(item => item.product);

  const totalAmount = getCartTotal();

  const onSubmit = async (data: CheckoutFormValues) => {
    setProcessingOrder(true);
    
    try {
      const result = await processCheckout({
        items: cart,
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        },
        paymentMethod: data.paymentMethod,
        totalAmount: totalAmount,
      });
      
      if (result.success) {
        toast.success(result.message);
        navigate("/order-confirmation", { 
          state: { 
            orderId: result.orderId,
            orderAmount: totalAmount,
            paymentMethod: data.paymentMethod,
          } 
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred during checkout. Please try again.");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[400px]">
          <p>Loading checkout...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/cart")} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
        </Button>
        
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <ShoppingBag className="mr-2 h-6 w-6" /> Checkout
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Contact Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t">
                      <h2 className="text-xl font-semibold">Shipping Information</h2>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter your complete address including city and PIN code" 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t">
                      <h2 className="text-xl font-semibold">Payment Method</h2>
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-3"
                              >
                                <div className="flex items-center space-x-2 border p-4 rounded-md">
                                  <RadioGroupItem value="card" id="card" />
                                  <Label htmlFor="card" className="flex items-center">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Pay with Credit/Debit Card
                                  </Label>
                                </div>
                                
                                <div className="flex items-center space-x-2 border p-4 rounded-md">
                                  <RadioGroupItem value="cod" id="cod" />
                                  <Label htmlFor="cod" className="flex items-center">
                                    <Truck className="mr-2 h-4 w-4" />
                                    Cash on Delivery
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full mt-8" 
                      disabled={processingOrder}
                    >
                      {processingOrder ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <div className="font-medium">
                          {item.product?.name} 
                          <span className="text-gray-500 ml-1">× {item.quantity}</span>
                        </div>
                      </div>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 mb-4 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
