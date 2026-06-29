"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
      } else {
        toast.success("Login successful!");
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col justify-center items-center p-4">
      <Link href="/" className="mb-8 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
        <img 
          src="/HireXplore.png" 
          alt="HireXplore Logo" 
          className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
        />
      </Link>

      <div className="w-full max-w-md bg-bg-card border border-border-default rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-text-primary mb-2 text-center">Welcome back</h1>
        <p className="text-text-muted text-center mb-8 text-sm">
          Enter your details to sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-brand-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="group/btn relative h-9 w-full rounded-md bg-brand-primary text-text-primary hover:bg-brand-primary text-sm font-bold shadow-[0px_1px_0px_0px_#00000040_inset,0px_-1px_0px_0px_#00000040_inset] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Signing in..." : "Sign in →"}
            <BottomGradient />
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-default" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg-card px-2 text-text-disabled">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4 bg-transparent text-text-primary border-border-default hover:bg-bg-hover"
            onClick={() => toast.info("Google login coming soon!")}
          >
            Google
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);
