"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

import { authClient } from "@/lib/auth-client";

export default function FooterComponent() {
  const { data: session } = authClient.useSession();

  const companyLinks = [
    { name: "About Us", link: "/about" },
    { name: "Features", link: "/#features" },
    { name: "Contact", link: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", link: "/privacy" },
    { name: "Terms of Service", link: "/terms" },
    { name: "Cookie Policy", link: "/cookies" },
  ];

  const socialLinks = [
    { icon: <FaLinkedin className="w-5 h-5" />, link: "#" },
    { icon: <FaGithub className="w-5 h-5" />, link: "#" },
    { icon: <FaTwitter className="w-5 h-5" />, link: "#" },
  ];

  return (
    <footer className="bg-[#050505] text-white border-t border-gray-900 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Logo and Intro */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center">
              <img 
                src="/HireXplore.png" 
                alt="HireXplore Logo" 
                className="h-14 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] transition-transform duration-300 hover:scale-[1.03]"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mt-2">
              Empowering your career with AI-driven job matching. Discover your next big opportunity without the hassle.
            </p>
            <div className="flex gap-4 mt-2">
              {socialLinks.map((social, idx) => (
                <a key={idx} href={social.link} className="text-gray-500 hover:text-cyan-500 transition-colors">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4 lg:ml-auto">
            <h3 className="text-lg font-bold text-white tracking-wide">Company</h3>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.link}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4 lg:ml-auto">
            <h3 className="text-lg font-bold text-white tracking-wide">Legal</h3>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.link}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Actions */}
          {!session ? (
            <div className="flex flex-col gap-4 lg:ml-auto">
              <h3 className="text-lg font-bold text-white tracking-wide">Get Started</h3>
              <p className="text-sm text-gray-400">Join thousands of job seekers today.</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="w-full bg-transparent border border-gray-700 text-white hover:bg-gray-800">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" className="w-full sm:w-auto">
                  <ShimmerButton className="w-full">Sign Up</ShimmerButton>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 lg:ml-auto">
              <h3 className="text-lg font-bold text-white tracking-wide">Account</h3>
              <Link href="/dashboard" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                Go to Dashboard →
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16 border-t border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} HireXplore. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs text-center md:text-right">
            Designed with ♥ for developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
