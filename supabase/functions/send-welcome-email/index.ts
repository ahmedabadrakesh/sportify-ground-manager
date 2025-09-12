import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to: ${email} for user: ${name}`);

    const emailResponse = await resend.emails.send({
      from: "hello@jokova.com",
      to: [email],
      subject: "Welcome to Jokova - Complete Your Sports Professional Profile! 🎯",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Jokova</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Jokova! 🎯</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Where sports professionals connect with the world</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Welcome to <a href="https://jokova.com/" style="color: #1e40af; text-decoration: none;">https://jokova.com/</a> – the platform where sports professionals connect with the world! 🎯
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              You registered with us through our team, and we're excited to have you on board. To make the most of your profile and get discovered by players, trainees, and organizations looking for the best coaches and trainers, please log in and complete your profile.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #1e40af; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af;">Your Account Details:</h3>
              <p style="margin: 5px 0;"><strong>Username:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Password:</strong> TempPassword123! <em>(Please change it on your first visit)</em></p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://jokova.com/login" style="background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                👉 Click here to log in and complete your profile
              </a>
            </div>
            
            <div style="background: #e1f5fe; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #0277bd;">A complete profile helps you:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Get more visibility in your sport</li>
                <li style="margin-bottom: 8px;">Connect with potential players, trainees, or organizations</li>
                <li style="margin-bottom: 8px;">Build your professional reputation</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              If you face any issue while logging in, just reply to this email and our support team will help you.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px; font-weight: bold; color: #1e40af;">
              We can't wait to see your profile live!
            </p>
          </div>
          
          <div style="text-align: center; padding: 25px; border-top: 2px solid #e2e8f0;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #1e40af;">Best regards,</p>
            <p style="margin: 5px 0; font-size: 16px; font-weight: bold; color: #1e40af;">Team Jokova</p>
            <p style="margin: 10px 0 0 0;">
              <a href="https://jokova.com/" style="color: #1e40af; text-decoration: none; font-weight: bold;">https://jokova.com/</a>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);