
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
import { toast } from "@/hooks/use-toast";
import { ShoppingBag, CreditCard, Truck, Check, ArrowLeft, Loader2 } from "lucide-react";
import { getCart, getCartTotal, processCheckout } from "@/utils/cart";
import { CartItem, Product, User } from "@/types/models";
import { getProductById } from "@/utils/ecommerce";
import { getCurrentUserSync } from "@/utils/auth";
import AuthRequiredDialog from "@/components/auth/AuthRequiredDialog";
import { createRazorpayOrder, initiateRazorpayPayment } from "@/services/razorpay";

const checkoutFormSchema = z.object({
  name: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 2, "Name must be at least 2 characters"),
  email: z.string().trim().min(1, "Invalid value").email("Please enter a valid email address"),
  phone: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 10, "Please enter a valid phone number"),
  address: z.string().trim().min(1, "Invalid value").refine(val => val.length >= 10, "Please enter your complete address"),
  paymentMethod: z.enum(["card", "cod"], { 
    required_error: "Please select a payment method" 
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const user = getCurrentUserSync();
      setCurrentUser(user);
    };

    checkUser();

    // Listen for auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser') {
        checkUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: "",
      address: "",
      paymentMethod: "card",
    },
  });

  useEffect(() => {
    // Check authentication first
    if (!currentUser) {
      // Store the intended destination
      localStorage.setItem('redirectAfterLogin', '/checkout');
      setShowAuthDialog(true);
      setLoading(false);
      return;
    }

    const loadCartData = async () => {
      try {
        const cartItems = getCart();
        if (cartItems.length === 0) {
          toast({ title: "Error", description: "Your cart is empty", variant: "destructive" });
          navigate("/cart");
          return;
        }
        
        setCart(cartItems);
        
        // Load product details for each cart item
        const productDetails: Record<string, Product> = {};
        for (const item of cartItems) {
          try {
            const product = await getProductById(item.productId);
            if (product) {
              productDetails[item.productId] = product;
            }
          } catch (error) {
            console.error(`Error loading product ${item.productId}:`, error);
          }
        }
        
        setProducts(productDetails);
      } catch (error) {
        console.error("Error loading checkout data:", error);
        toast({ title: "Error", description: "Failed to load checkout data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    
    loadCartData();
  }, [navigate, currentUser]);

  const cartItems = cart.map(item => {
    const product = products[item.productId];
    return { 
      ...item, 
      product,
      subtotal: product ? product.price * item.quantity : 0
    };
  }).filter(item => item.product);

  const totalAmount = getCartTotal();

  const handlePaymentSuccess = async (paymentData: any, customerData: CheckoutFormValues) => {
    try {
      const result = await processCheckout({
        items: cart,
        customer: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
        },
        paymentMethod: customerData.paymentMethod,
        totalAmount: totalAmount,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpayOrderId: paymentData.razorpay_order_id,
        razorpaySignature: paymentData.razorpay_signature,
      });
      
      if (result.success) {
        toast({ title: "Success", description: "Payment successful! Your order has been placed." });
        navigate("/order-confirmation", { 
          state: { 
            orderId: result.orderId,
            orderAmount: totalAmount,
            paymentMethod: customerData.paymentMethod,
          } 
        });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Payment verification failed. Please contact support.", variant: "destructive" });
    } finally {
      setProcessingOrder(false);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setProcessingOrder(true);
    
    try {
      if (data.paymentMethod === 'card') {
        try {
          console.log('Creating Razorpay order for amount:', totalAmount * 100);
          // Create Razorpay order
          const razorpayOrder = await createRazorpayOrder(totalAmount * 100); // Convert to paise
          console.log('Razorpay order created:', razorpayOrder);
          
          // Initialize Razorpay payment
          await initiateRazorpayPayment({
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'Jokova Sports',
            description: 'Sports equipment purchase',
            order_id: razorpayOrder.id,
            handler: (response: any) => {
              console.log('Razorpay payment response:', response);
              handlePaymentSuccess(response, data);
            },
            prefill: {
              name: data.name,
              email: data.email,
              contact: data.phone,
            },
            theme: {
              color: '#10b981',
            },
          });
        } catch (razorpayError) {
          console.error('Razorpay error:', razorpayError);
          toast({ 
            title: "Payment Gateway Error", 
            description: "Unable to initialize payment gateway. Please try Cash on Delivery or contact support.", 
            variant: "destructive" 
          });
          setProcessingOrder(false);
        }
      } else {
        // Handle Cash on Delivery
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
          toast({ title: "Success", description: result.message });
          navigate("/order-confirmation", { 
            state: { 
              orderId: result.orderId,
              orderAmount: totalAmount,
              paymentMethod: data.paymentMethod,
            } 
          });
        } else {
          toast({ title: "Error", description: result.message, variant: "destructive" });
        }
        setProcessingOrder(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({ title: "Error", description: "An error occurred during checkout. Please try again.", variant: "destructive" });
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

  // Show auth dialog if user is not authenticated
  if (!currentUser) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">Please log in to continue with checkout</p>
            <Button onClick={() => setShowAuthDialog(true)}>
              Login or Register
            </Button>
          </div>
        </div>
        <AuthRequiredDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog}
          title="Login Required for Checkout"
          description="You need to be logged in to proceed with checkout. Please login or create an account to continue."
        />
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
