"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle, IconMail, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const SignupPage = () => {
  const router = useRouter();

  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ============================================
  // GITHUB SIGN UP
  // ============================================
  const handleGitHubSignUp = async () => {
    setError("");
    setSocialLoading("github");

    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error("GitHub signup error:", err);
      setError(err instanceof Error ? err.message : "GitHub signup failed");
      setSocialLoading(null);
    }
  };

  // ============================================
  // GOOGLE SIGN UP
  // ============================================
  const handleGoogleSignUp = async () => {
    setError("");
    setSocialLoading("google");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error("Google signup error:", err);
      setError(err instanceof Error ? err.message : "Google signup failed");
      setSocialLoading(null);
    }
  };

  // ============================================
  // STEP 1: SIGNUP FORM SUBMISSION
  // ============================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        project: process.env.NEXT_PUBLIC_PROJECT_NAME || "JobPortal",
      });

      if (signUpError) {
        throw new Error(signUpError.message || "Signup failed");
      }
      
      // Request OTP to be sent
      const { error: otpError } = await authClient.emailOtp.sendVerificationOtp({
        email: formData.email,
        type: "email-verification",
      });
      
      if (otpError) {
        throw new Error(otpError.message || "Failed to send verification code");
      }

      console.log("Signup successful, moving to OTP verification");
      setStep("verify");

    } catch (err) {
      console.error("Signup error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // STEP 2: OTP VERIFICATION
  // ============================================
  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: verifyError } = await authClient.emailOtp.verifyEmail({
        email: formData.email,
        otp: otp,
      });

      if (verifyError) {
        throw new Error(verifyError.message || "Verification failed");
      }

      console.log("Email verified successfully");
      window.location.href = "/dashboard";

    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RESEND OTP
  // ============================================
  const handleResendOTP = async () => {
    setError("");
    setLoading(true);

    try {
      const { error: resendError } = await authClient.emailOtp.sendVerificationOtp({
        email: formData.email,
        type: "email-verification",
      });

      if (resendError) {
        throw new Error(resendError.message);
      }

      alert("New OTP sent to your email!");

    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER: OTP VERIFICATION SCREEN
  // ============================================
  if (step === "verify") {
    return (
      <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-bg-main transition-colors duration-300 relative">
        <a href="/" className="mb-8 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
          <img 
            src="/HireXplore.png" 
            alt="HireXplore Logo" 
            className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
          />
        </a>
        <div className="shadow-input mx-auto w-full max-w-md rounded-2xl p-6 bg-bg-card transition-colors duration-300">
          <h2 className="text-xl font-bold text-text-primary">Verify Your Email</h2>
          <p className="mt-2 text-sm text-text-secondary">
            We sent a 6-digit code to{" "}
            <span className="text-brand-primary">{formData.email}</span>
          </p>

          {error && <ErrorBox message={error} />}

          <form className="mt-6" onSubmit={handleVerifyOTP}>
            <LabelInputContainer className="mb-5">
              <Label htmlFor="otp" className="text-text-primary">Enter OTP</Label>
              <Input
                id="otp"
                placeholder="123456"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                className="text-center text-2xl tracking-widest placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary bg-bg-main border-border-default text-text-primary"
              />
            </LabelInputContainer>

            <div className="flex flex-col items-center space-y-3">
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="group/btn relative h-10 w-44 rounded-md bg-brand-primary text-text-primary font-medium shadow-[0px_1px_0px_0px_#00000040_inset,0px_-1px_0px_0px_#00000040_inset] transition duration-300 hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify Email →"}
                <BottomGradient />
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-sm text-brand-primary hover:underline disabled:opacity-50"
              >
                Did not receive code? Resend OTP
              </button>

              <button
                type="button"
                onClick={() => setStep("signup")}
                className="text-sm text-text-muted hover:text-text-primary"
              >
                ← Back to signup
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: SIGNUP FORM
  // ============================================
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-bg-main transition-colors duration-300 relative">
      <a href="/" className="mb-8 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
        <img 
          src="/HireXplore.png" 
          alt="HireXplore Logo" 
          className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
        />
      </a>
      <div className="shadow-input mx-auto w-full max-w-md rounded-2xl p-5 bg-bg-card transition-colors duration-300">
        <h2 className="text-lg font-bold text-text-primary text-center">Welcome to HireXplore</h2>
        <p className="mt-1 text-sm text-text-secondary text-center">Create your account to get started</p>

        {error && <ErrorBox message={error} />}

        <div className="mt-5 space-y-3">

          {/* Google - Primary Option */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={socialLoading === "google"}
            className="group/btn shadow-input relative flex h-11 w-full items-center justify-center space-x-2 rounded-md bg-bg-card-elevated px-4 font-medium text-text-primary hover:bg-bg-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconBrandGoogle className="h-5 w-5 text-text-primary" />
            <span className="text-sm text-text-primary">
              {socialLoading === "google" ? "Connecting..." : "Continue with Google"}
            </span>
            <BottomGradient />
          </button>


          {/* GitHub - Primary Option */}
          <button
            type="button"
            onClick={handleGitHubSignUp}
            disabled={socialLoading === "github"}
            className="group/btn shadow-input relative flex h-11 w-full items-center justify-center space-x-2 rounded-md bg-bg-card-elevated px-4 font-medium text-text-primary hover:bg-bg-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconBrandGithub className="h-5 w-5 text-text-primary" />
            <span className="text-sm text-text-primary">
              {socialLoading === "github" ? "Connecting..." : "Continue with GitHub"}
            </span>
            <BottomGradient />
          </button>

          {/* Divider */}
          <div className="flex items-center py-1">
            <div className="h-[1px] flex-1 bg-bg-hover" />
            <span className="px-3 text-xs text-text-disabled">or</span>
            <div className="h-[1px] flex-1 bg-bg-hover" />
          </div>

          {/* Email Option - Expandable */}
          <button
            type="button"
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="group/btn shadow-input relative flex h-11 w-full items-center justify-center space-x-2 rounded-md bg-transparent border border-border-default px-4 font-medium text-text-primary hover:bg-bg-card-elevated/50 transition-colors"
          >
            <IconMail className="h-5 w-5 text-text-primary" />
            <span className="text-sm text-text-primary">Continue with Email</span>
            {showEmailForm ? (
              <IconChevronUp className="h-4 w-4 text-text-muted ml-auto" />
            ) : (
              <IconChevronDown className="h-4 w-4 text-text-muted ml-auto" />
            )}
          </button>

          {/* Email Form - Collapsible */}
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            showEmailForm ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}>
            <form className="pt-3 space-y-2.5" onSubmit={handleSubmit}>
              {/* First & Last Name - Side by Side */}
              <div className="flex space-x-2">
                <LabelInputContainer>
                  <Label htmlFor="firstName" className="text-text-primary text-xs">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required={showEmailForm}
                    className="text-text-primary placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary h-9 text-sm bg-bg-card border-border-default"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="lastName" className="text-text-primary text-xs">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required={showEmailForm}
                    className="text-text-primary placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary h-9 text-sm bg-bg-card border-border-default"
                  />
                </LabelInputContainer>
              </div>

              {/* Email */}
              <LabelInputContainer>
                <Label htmlFor="email" className="text-text-primary text-xs">Email Address</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required={showEmailForm}
                  className="text-text-primary placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary h-9 text-sm bg-bg-card border-border-default"
                />
              </LabelInputContainer>

              {/* Password & Confirm - Side by Side */}
              <div className="flex space-x-2">
                <LabelInputContainer>
                  <Label htmlFor="password" className="text-text-primary text-xs">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required={showEmailForm}
                      className="text-text-primary placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary h-9 text-sm bg-bg-card border-border-default pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="confirmPassword" className="text-text-primary text-xs">Confirm</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={showEmailForm}
                      className="text-text-primary placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary h-9 text-sm bg-bg-card border-border-default pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </LabelInputContainer>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group/btn relative h-9 w-full rounded-md bg-brand-primary text-text-primary hover:bg-brand-primary text-sm font-bold shadow-[0px_1px_0px_0px_#00000040_inset,0px_-1px_0px_0px_#00000040_inset] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? "Signing up..." : "Sign up with Email →"}
                <BottomGradient />
              </button>
            </form>
          </div>

          <p className="text-sm text-text-muted text-center pt-2">
            Already have an account?{" "}
            <a href="/login" className="text-brand-primary hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// HELPER COMPONENTS
// ============================================
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
  <div className="mt-3 p-2 rounded-md bg-status-error/20 border border-status-error">
    <p className="text-sm text-status-error text-center">{message}</p>
  </div>
);

export default SignupPage;
