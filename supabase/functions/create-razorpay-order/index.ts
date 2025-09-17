import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Razorpay from "https://esm.sh/razorpay@2.9.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'INR' } = await req.json()
    
    console.log('Received request:', { amount, currency })

    // Get Razorpay credentials from environment
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    console.log('Razorpay credentials check:', { 
      keyIdExists: !!keyId, 
      keySecretExists: !!keySecret,
      keyIdPrefix: keyId ? keyId.substring(0, 8) + '...' : 'missing'
    })

    if (!keyId || !keySecret) {
      console.error('Missing Razorpay credentials')
      throw new Error('Razorpay credentials not configured')
    }

    // Initialize Razorpay instance
    console.log('Initializing Razorpay...')
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    // Create Razorpay order
    console.log('Creating Razorpay order with:', { amount, currency })
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    })

    console.log('Razorpay order created successfully:', order.id)

    return new Response(
      JSON.stringify({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    console.error('Error details:', error.message, error.stack)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create order',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})