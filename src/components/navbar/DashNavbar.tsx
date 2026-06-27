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
    { name: "Dashboard", link: "/dashboard" },
    { name: "Search Job", link: "/findJobs" },
    { name: "Saved Jobs", link: "/savedJobs" },
  ];

  const handleLogout = async () => {
    setProfileOpen(false);
    setMenuOpen(false);
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar className="fixed top-0 left-0 w-full z-50 bg-black">
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="text-white text-2xl p-1 rounded-full hover:text-gray-300"
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
                className="absolute right-0 mt-2 w-40 bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden z-50"
              >
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-800"
                  onClick={() => setProfileOpen(false)}
                >
                  Profile
                </Link>

                <button
                  type="button"
                  className="w-full text-left px-4 py-2 mt-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
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
            <a
              key={index}
              href={item.link}
              className="text-lg font-medium text-neutral-200"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}

          <div className="mt-4 border-t border-gray-700 pt-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-neutral-200 hover:bg-gray-800 rounded"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>

            <button
              className="w-full text-left px-4 py-2 hover:bg-red-600 text-white rounded"
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
