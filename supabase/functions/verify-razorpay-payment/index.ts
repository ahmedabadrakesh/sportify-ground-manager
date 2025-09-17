import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHash, createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    // Get Razorpay secret key from environment
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!keySecret) {
      throw new Error('Razorpay secret key not configured')
    }

    // Verify the payment signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = createHmac("sha256", keySecret)
      .update(body)
      .toString("hex");

    if (expectedSignature === razorpaySignature) {
      return new Response(
        JSON.stringify({ success: true, message: "Payment verified successfully" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Payment verification failed" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error)
    return new Response(
      JSON.stringify({ success: false, message: "Payment verification failed" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})