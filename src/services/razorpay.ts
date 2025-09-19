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
    console.log('🚀 Starting createRazorpayOrder with:', { amount, currency });
    console.log('🔧 Supabase client:', !!supabase);
    console.log('🔧 Supabase client functions:', !!supabase.functions);
    
    console.log('📞 About to invoke create-razorpay-order function...');
    
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { amount, currency }
    });

    console.log('📦 Supabase function response:', { data, error });
    console.log('📦 Full response data:', JSON.stringify(data, null, 2));
    console.log('📦 Full error:', JSON.stringify(error, null, 2));

    if (error) {
      console.error('❌ Supabase function error:', error);
      throw new Error(`Payment service error: ${error.message || 'Unknown error'}`);
    }
    
    if (!data || !data.id) {
      console.error('❌ Invalid response from payment service:', data);
      throw new Error('Invalid response from payment service');
    }
    
    console.log('✅ Razorpay order created successfully:', data);
    return data;
  } catch (error) {
    console.error('💥 Error creating Razorpay order:', error);
    console.error('💥 Error type:', typeof error);
    console.error('💥 Error message:', error?.message);
    console.error('💥 Error stack:', error?.stack);
    throw error;
  }
};

export const initiateRazorpayPayment = async (options: RazorpayOptions): Promise<void> => {
  console.log('🎯 Starting initiateRazorpayPayment with options:', options);
  
  const scriptLoaded = await loadRazorpayScript();
  console.log('📜 Razorpay script loaded:', scriptLoaded);
  
  if (!scriptLoaded) {
    console.error('❌ Failed to load Razorpay SDK');
    throw new Error('Failed to load Razorpay SDK');
  }

  console.log('🔧 Creating Razorpay instance...');
  const rzp = new window.Razorpay(options);
  console.log('🚀 Opening Razorpay payment window...');
  rzp.open();
};