"use client";
import { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavToggle,
  MobileNavHeader,
  MobileNavMenu,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import Link from "next/link";

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "/#features" },
    { name: "About", link: "/about" },
  ];

  return (
    <Navbar className="fixed top-0 left-0 w-full z-50 bg-bg-main">
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />

        <div className="flex items-center gap-4">
          <NavbarButton href="/login" variant="secondary">
            <Button>Log In</Button>
          </NavbarButton>

          <Link href="/signup">
            <ShimmerButton>Sign Up</ShimmerButton>
          </Link>
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
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button className="w-full">Log In</Button>
            </Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)}>
               <ShimmerButton className="w-full">Sign Up</ShimmerButton>
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
