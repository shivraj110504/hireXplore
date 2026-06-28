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
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <Link href="/" className="mb-8 flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
        <img 
          src="/HireXplore.png" 
          alt="HireXplore Logo" 
          className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
        />
      </Link>

      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Welcome back</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
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
              <Link href="/forgot-password" className="text-xs text-cyan-500 hover:underline">
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

          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 mt-6" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#111] px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4 bg-transparent text-white border-gray-700 hover:bg-gray-800"
            onClick={() => toast.info("Google login coming soon!")}
          >
            Google
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-cyan-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
