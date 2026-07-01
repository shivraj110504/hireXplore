"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavToggle,
  MobileNavHeader,
  MobileNavMenu,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function DashNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        if (data.profile?.profilePicture) {
          setProfilePic(data.profile.profilePicture);
        }
      })
      .catch(err => console.error("Failed to load profile pic:", err));
  }, []);

  const navItems = [
    { name: "Home", link: "/dashboard" },
    { name: "Search Job", link: "/findJobs" },
    { name: "Saved Jobs", link: "/savedJobs" },
    { name: "About", link: "/about" },
  ];

  const handleLogout = async () => {
    setProfileOpen(false);
    setMenuOpen(false);
    try {
      await authClient.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar className="fixed top-0 left-0 w-full z-50 bg-bg-main">
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />

        <div className="flex items-center gap-4" ref={profileRef}>
          <Link href="/notifications" className="p-2 rounded-full hover:bg-bg-hover transition-colors">
            <Bell className="w-5 h-5 text-text-primary hover:text-brand-primary" />
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="text-text-primary rounded-full hover:opacity-80 transition-opacity overflow-hidden flex items-center justify-center w-8 h-8 border border-brand-primary"
              aria-label="User profile menu"
            >
              {profilePic ? (
                <img src={profilePic} alt="User" className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle className="text-2xl" />
              )}
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-bg-card-elevated text-text-primary rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-bg-hover"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-bg-hover"
                    onClick={() => setProfileOpen(false)}
                  >
                    Settings
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex items-center gap-2">
            <Link href="/notifications" className="p-2 rounded-full hover:bg-bg-hover transition-colors flex items-center justify-center">
              <Bell className="w-5 h-5 text-text-primary hover:text-brand-primary" />
            </Link>
            <MobileNavToggle
              isOpen={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
          <div className="flex flex-col items-center justify-center w-full gap-5 py-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="text-lg font-semibold text-text-secondary hover:text-brand-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="w-16 h-px bg-border-focus my-2"></div>

            <Link
              href="/profile"
              className="text-lg font-semibold text-text-secondary hover:text-brand-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>

            <Link
              href="/settings"
              className="text-lg font-semibold text-text-secondary hover:text-brand-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
