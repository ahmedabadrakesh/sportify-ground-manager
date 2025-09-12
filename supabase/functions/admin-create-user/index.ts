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
  adminId?: string // Optional for predefined admins
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, name, userType, adminId }: CreateUserRequest = await req.json()

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

    // Check authorization - either JWT token or predefined admin ID
    const authHeader = req.headers.get('Authorization')
    let isAuthorized = false;

    if (authHeader) {
      // Try JWT authentication first
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
      
      if (!userError && user) {
        // Check if user is admin or super_admin
        const { data: userData, error: roleError } = await supabaseAdmin
          .from('users')
          .select('role')
          .eq('auth_id', user.id)
          .single()

        if (!roleError && userData && ['admin', 'super_admin'].includes(userData.role)) {
          isAuthorized = true;
        }
      }
    }
    
    // If JWT auth failed, check for predefined admin ID
    if (!isAuthorized && adminId) {
      const predefinedAdminIds = [
        '00000000-0000-0000-0000-000000000001', // Super Admin (sa@123456)
        '00000000-0000-0000-0000-000000000002', // Admin (a@123456)
        '00000000-0000-0000-0000-000000000003', // Super Admin (ronak@jokova.com)
        '00000000-0000-0000-0000-000000000004', // Super Admin (damini@jokova.com)
      ];
      
      if (predefinedAdminIds.includes(adminId)) {
        isAuthorized = true;
        console.log('Authorized predefined admin:', adminId);
      }
    }

    if (!isAuthorized) {
      throw new Error('Insufficient permissions - not authorized to create users')
    }

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

      const userData = userProfile || newProfile;
      console.log('User created successfully:', userData);

      // Send welcome email using Supabase's password reset as welcome email
      try {
        console.log('Sending welcome email via password reset to:', email);
        
        const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: email,
          options: {
            redirectTo: 'https://jokova.com/login?welcome=true'
          }
        });

        if (resetError) {
          console.error('Failed to send welcome email:', resetError);
        } else {
          console.log('Welcome email sent successfully via password reset');
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail user creation if email fails
      }

      return new Response(
        JSON.stringify({ success: true, user: userData, welcomeEmailSent: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    const userData = userProfile;
    console.log('User created successfully:', userData);

    // Send welcome email using Supabase's password reset as welcome email
    try {
      console.log('Sending welcome email via password reset to:', email);
      
      const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
          redirectTo: 'https://jokova.com/login?welcome=true'
        }
      });

      if (resetError) {
        console.error('Failed to send welcome email:', resetError);
      } else {
        console.log('Welcome email sent successfully via password reset');
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail user creation if email fails
    }

    return new Response(
      JSON.stringify({ success: true, user: userData, welcomeEmailSent: true }),
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