"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";

import { authClient } from "@/lib/auth-client";

export default function FooterComponent() {
  const { data: session } = authClient.useSession();

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Features", link: "/#features" },
  ];

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center">
              <img 
                src="/HireXplore.png" 
                alt="HireXplore Logo" 
                className="h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] transition-transform duration-300 hover:scale-[1.03]"
              />
            </Link>
            <p className="max-w-xs text-gray-400">
              Empowering your career with AI-driven job matching.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="flex flex-col gap-1">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {!session && (
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Join Us</h3>
              <div className="flex gap-2 mt-2">
                <Link href="/login">
                  <Button className="bg-white text-black">Log In</Button>
                </Link>
                <Link href="/signup">
                  <ShimmerButton>Sign Up</ShimmerButton>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} HireXplore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
