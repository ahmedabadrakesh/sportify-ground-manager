import { supabase } from "@/integrations/supabase/client";

interface RazorpayOptions {
  amount: number; // in paise (1 INR = 100 paise)
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  try {
    console.log('Invoking create-razorpay-order function with:', { amount, currency });
    
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { amount, currency }
    });

    console.log('Supabase function response:', { data, error });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Payment service error: ${error.message || 'Unknown error'}`);
    }
    
    if (!data || !data.id) {
      throw new Error('Invalid response from payment service');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const initiateRazorpayPayment = async (options: RazorpayOptions): Promise<void> => {
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  const rzp = new window.Razorpay(options);
  rzp.open();
};