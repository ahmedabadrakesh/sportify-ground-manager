import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateUserRequest {
  email: string
  password: string
  name: string
  userType: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the requesting user is an admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Invalid authentication')
    }

    // Check if user is admin or super_admin
    const { data: userData, error: roleError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single()

    if (roleError || !userData || !['admin', 'super_admin'].includes(userData.role)) {
      throw new Error('Insufficient permissions')
    }

    const { email, password, name, userType }: CreateUserRequest = await req.json()

    // Create user using admin client (this doesn't affect current session)
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        user_type: userType
      }
    })

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`)
    }

    // Wait a moment for trigger to process
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Get the created user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_id', authUser.user.id)
      .single()

    if (profileError) {
      // Create profile manually if trigger didn't work
      const { data: newProfile, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          auth_id: authUser.user.id,
          name,
          email,
          role: userType === 'sports_professional' ? 'sports_professional' : 'user'
        })
        .select()
        .single()

      if (insertError) {
        throw new Error(`Failed to create user profile: ${insertError.message}`)
      }

      return new Response(
        JSON.stringify({ success: true, user: newProfile }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, user: userProfile }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Admin create user error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})