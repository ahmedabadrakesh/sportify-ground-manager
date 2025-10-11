import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    
    console.log('🚀 Received request:', { amount, currency })

    // Get Razorpay credentials from environment
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    console.log('🔑 Razorpay credentials check:', { 
      keyIdExists: !!keyId, 
      keySecretExists: !!keySecret,
      keyIdPrefix: keyId ? keyId.substring(0, 8) + '...' : 'missing'
    })

    if (!keyId || !keySecret) {
      console.error('❌ Missing Razorpay credentials')
      throw new Error('Razorpay credentials not configured')
    }

    // Create order using direct API call instead of library
    const orderData = {
      amount: amount, // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    }

    console.log('📦 Creating order with data:', orderData)

    // Create basic auth header
    const auth = btoa(`${keyId}:${keySecret}`)
    
    console.log('🌐 Making API call to Razorpay...')
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(orderData),
    })

    console.log('📡 Razorpay API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Razorpay API error:', response.status, errorText)
      throw new Error(`Razorpay API error: ${response.status} - ${errorText}`)
    }

    const order = await response.json()
    console.log('✅ Razorpay order created successfully:', order.id)

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
    console.error('💥 Error creating Razorpay order:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('💥 Error details:', errorMessage, errorStack)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create order',
        details: errorMessage,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})