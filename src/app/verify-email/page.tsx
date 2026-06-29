"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State for missing email (GitHub edge case)
  const [email, setEmail] = useState("");
  const [needsEmail, setNeedsEmail] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);

  // OTP State
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const { data, error } = await authClient.getSession();
        if (error || !data) {
          router.push("/login");
          return;
        }
        
        if (data.user.emailVerified) {
          router.push("/dashboard");
          return;
        }

        setSession(data);
        if (!data.user.email) {
          setNeedsEmail(true);
        } else {
          setEmail(data.user.email);
        }
      } catch (err) {
        toast.error("Failed to load session");
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [router]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingEmail(true);
    try {
      // For better-auth, changing email requires a specific endpoint or update user method
      const { error } = await authClient.updateUser({
        // @ts-expect-error - better-auth types might not expose email on updateUser
        email: email
      });
      if (error) {
        toast.error(error.message || "Failed to update email");
        return;
      }
      setNeedsEmail(false);
      handleSendOTP(email);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleSendOTP = async (targetEmail: string = email) => {
    if (!targetEmail) return;
    setSendingOTP(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: targetEmail,
        type: "email-verification",
      });
      if (error) {
        toast.error(error.message || "Failed to send code");
      } else {
        toast.success("Verification code sent!");
        setOtpSent(true);
      }
    } catch (err) {
      toast.error("Something went wrong while sending code.");
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email: email,
        otp: otp,
      });

      if (error) {
        toast.error(error.message || "Invalid or expired code");
      } else {
        toast.success("Email verified successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Failed to verify code");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
        <p className="text-text-primary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main flex flex-col justify-center items-center p-4">
      <Link href="/" className="mb-8 flex items-center space-x-2">
        <span className="font-bold text-brand-primary text-3xl">⚡</span>
        <span className="font-bold text-text-primary text-3xl">HireXplore</span>
      </Link>

      <div className="w-full max-w-md bg-bg-card border border-border-default rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-text-primary mb-2 text-center">Verify your email</h1>
        
        <div className="bg-brand-primary border border-border-focus rounded-lg p-4 mb-6">
          <p className="text-brand-primary text-sm text-center">
            Your verified email is required so we can send you job application links and other important updates.
          </p>
        </div>

        {needsEmail ? (
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <p className="text-text-muted text-sm mb-4">
              Your authentication provider did not share an email address. Please provide one to continue.
            </p>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-brand-primary text-text-primary hover:bg-brand-primary" disabled={updatingEmail}>
              {updatingEmail ? "Saving..." : "Continue"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-text-muted text-sm">We need to verify the email address:</p>
              <p className="text-text-primary font-medium mt-1">{email}</p>
            </div>
            
            {!otpSent ? (
              <Button 
                onClick={() => handleSendOTP()} 
                className="w-full bg-brand-primary text-text-primary hover:bg-brand-primary-hover" 
                disabled={sendingOTP}
              >
                {sendingOTP ? "Sending code..." : "Send Verification Code"}
              </Button>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">6-Digit Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className="text-center text-lg tracking-[0.5em] font-mono"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-brand-primary text-text-primary hover:bg-brand-primary mt-2" disabled={verifying || otp.length < 6}>
                  {verifying ? "Verifying..." : "Verify & Continue"}
                </Button>
                
                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={() => handleSendOTP()} 
                    className="text-xs text-brand-primary hover:underline"
                    disabled={sendingOTP}
                  >
                    Didn&apos;t receive it? Resend code
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
