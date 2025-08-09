import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  email: string;
  phone: string;
  registrationType: "email" | "phone";
  onVerificationSuccess: () => void;
  onResendOTP: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  phone,
  registrationType,
  onVerificationSuccess,
  onResendOTP
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);

    try {
      const verifyOtpParams = registrationType === "email" 
        ? {
            email,
            token: otp,
            type: "email" as const
          }
        : {
            phone: `+91${phone}`,
            token: otp,
            type: "sms" as const
          };
      
      const { data, error } = await supabase.auth.verifyOtp(verifyOtpParams);

      if (error) {
        console.error("OTP verification error:", error);
        if (error.message?.includes("invalid") || error.message?.includes("expired")) {
          toast.error("Invalid or expired OTP. Please try again.");
        } else {
          toast.error("OTP verification failed. Please try again.");
        }
        return;
      }

      if (data.user) {
        toast.success("Email/Phone verified successfully!");
        onVerificationSuccess();
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      setCountdown(60);
      setCanResend(false);
      onResendOTP();
      toast.success("OTP sent successfully!");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Verify Your {registrationType === "email" ? "Email" : "Phone"}</CardTitle>
        <p className="text-sm text-gray-600 text-center">
          We've sent a 6-digit verification code to{" "}
          <span className="font-medium">
            {registrationType === "email" ? email : phone}
          </span>
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={isVerifying}
              maxLength={6}
              className="text-center text-lg tracking-wider"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </Button>
          
          <div className="text-center">
            {canResend ? (
              <Button
                variant="link"
                onClick={handleResendOTP}
                className="text-sm"
              >
                Resend OTP
              </Button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend OTP in {countdown}s
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;