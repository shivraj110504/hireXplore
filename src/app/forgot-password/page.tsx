"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // STEP 1: REQUEST OTP
  // ============================================
  const handleRequestOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use Better Auth's Email OTP plugin to send an OTP specifically for forget-password
      const { error: otpError } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });
      
      if (otpError) {
        throw new Error(otpError.message || "Failed to send verification code");
      }

      toast.success("OTP sent to your email!");
      setStep("verify");

    } catch (err) {
      console.error("OTP request error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // STEP 2: VERIFY OTP
  // ============================================
  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call our custom API route to verify the OTP directly against MongoDB
      // (because Better Auth OTP doesn't expose a direct password reset without a token in the client)
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      toast.success("OTP Verified! Please enter your new password.");
      setStep("reset");

    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // STEP 3: RESET PASSWORD
  // ============================================
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", email, otp, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      toast.success("Password updated successfully!");
      window.location.href = "/login";

    } catch (err) {
      console.error("Reset password error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDERS
  // ============================================
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-black transition-colors duration-300 relative">
      <a href="/" className="mb-8 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
        <img 
          src="/HireXplore.png" 
          alt="HireXplore Logo" 
          className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
        />
      </a>
      
      <div className="shadow-input mx-auto w-full max-w-md rounded-2xl p-6 bg-[#171717] transition-colors duration-300">
        {error && <ErrorBox message={error} />}

        {step === "email" && (
          <>
            <h2 className="text-xl font-bold text-white text-center">Reset your Password</h2>
            <p className="mt-2 text-sm text-gray-400 text-center mb-6">
              Enter your email address and we will send you a 6-digit verification code.
            </p>
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <LabelInputContainer>
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-white placeholder-gray-500 bg-black border-[#3A3A3A] focus:ring-cyan-500"
                />
              </LabelInputContainer>
              
              <button
                type="submit"
                disabled={loading || !email}
                className="group/btn relative h-10 w-full rounded-md bg-cyan-600 text-white font-medium transition duration-300 hover:bg-cyan-700 disabled:opacity-50 mt-4"
              >
                {loading ? "Sending..." : "Send OTP"}
                <BottomGradient />
              </button>
            </form>
          </>
        )}

        {step === "verify" && (
          <>
            <h2 className="text-xl font-bold text-white text-center">Verify OTP</h2>
            <p className="mt-2 text-sm text-gray-400 text-center mb-6">
              We sent a 6-digit code to <span className="text-cyan-500">{email}</span>
            </p>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <LabelInputContainer>
                <Label htmlFor="otp" className="text-white">Enter OTP</Label>
                <Input
                  id="otp"
                  placeholder="123456"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  className="text-center text-2xl tracking-widest placeholder-gray-500 bg-black border-[#3A3A3A] text-white focus:ring-cyan-500"
                />
              </LabelInputContainer>
              
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="group/btn relative h-10 w-full rounded-md bg-cyan-600 text-white font-medium transition duration-300 hover:bg-cyan-700 disabled:opacity-50 mt-4"
              >
                {loading ? "Verifying..." : "Verify"}
                <BottomGradient />
              </button>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <h2 className="text-xl font-bold text-white text-center">Create New Password</h2>
            <p className="mt-2 text-sm text-gray-400 text-center mb-6">
              Please enter a strong new password below.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <LabelInputContainer>
                <Label htmlFor="password" className="text-white">New Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-white placeholder-gray-500 bg-black border-[#3A3A3A] focus:ring-cyan-500"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="text-white placeholder-gray-500 bg-black border-[#3A3A3A] focus:ring-cyan-500"
                />
              </LabelInputContainer>
              
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="group/btn relative h-10 w-full rounded-md bg-cyan-600 text-white font-medium transition duration-300 hover:bg-cyan-700 disabled:opacity-50 mt-4"
              >
                {loading ? "Updating..." : "Update Password"}
                <BottomGradient />
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => window.location.href = "/login"}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-1", className)}>{children}</div>
);

const ErrorBox = ({ message }: { message: string }) => (
  <div className="mt-3 p-2 rounded-md bg-red-900/30 border border-red-800 mb-4">
    <p className="text-sm text-red-400 text-center">{message}</p>
  </div>
);
