import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateAdminRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Function invoked with method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing request...');
    
    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Environment check - URL exists:', !!supabaseUrl, 'Service key exists:', !!supabaseServiceKey);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          code: 'missing_env_vars'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Validate request body
    let requestData;
    try {
      requestData = await req.json();
      console.log('Request data received:', { email: requestData.email });
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          code: 'invalid_json'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const { email, password, firstName, lastName, phone, birthdate, gender }: CreateAdminRequest = requestData;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: email, password, firstName, lastName',
          code: 'missing_required_fields'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Creating user with email:', email);

    // Create the admin user
    const { data: userData, error: userError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        birthdate: birthdate,
        gender: gender,
      },
      email_confirm: true,
    });

    if (userError) {
      console.error('Error creating admin user:', userError);
      
      // Handle specific error cases
      if (userError.message?.includes('already been registered') || userError.message?.includes('already exists')) {
        return new Response(
          JSON.stringify({ 
            error: 'A user with this email address already exists',
            code: 'email_exists'
          }),
          {
            status: 409, // Conflict status for already exists
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          error: userError.message || 'Failed to create user',
          code: userError.code || 'unknown_error'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    if (!userData.user) {
      console.error('No user data returned');
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create user - no user data returned',
          code: 'no_user_data'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('User created successfully:', userData.user.id);

    // Set the admin role
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'admin'
      });

    if (roleError) {
      console.error('Error setting admin role:', roleError);
      return new Response(
        JSON.stringify({ 
          error: 'User created but failed to set admin role',
          code: 'role_assignment_failed',
          user: userData.user
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Admin role assigned successfully');

    return new Response(
      JSON.stringify({ 
        message: 'Admin user created successfully',
        user: userData.user 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in create-admin function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        code: 'internal_error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);