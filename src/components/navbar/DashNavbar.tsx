"use client";

import { useState, useRef } from "react";
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
import { AnimatePresence, motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function DashNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="text-text-primary text-2xl p-1 rounded-full hover:text-text-secondary"
            aria-label="User profile menu"
          >
            <FaUserCircle />
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

                <button
                  type="button"
                  className="w-full text-left px-4 py-2 mt-1 bg-status-error hover:bg-status-error text-text-primary rounded-md transition"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="text-lg font-medium text-text-secondary"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="mt-4 border-t border-border-default pt-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-text-secondary hover:bg-bg-hover rounded"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>

            <button
              className="w-full text-left px-4 py-2 hover:bg-status-error text-text-primary rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
