"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/organization", label: "Overview" },
  { href: "/assessments", label: "Assessments" },
  { href: "/documents", label: "Documents" },
  { href: "/metrics", label: "ESG Metrics" },
  { href: "/reports", label: "Reports" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const orgName = session?.user?.name ?? "";
  const initial = orgName.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-emerald-700/30  bg-white">
      <div className="mx-auto flex h-full max-w-full items-center justify-between px-12">
        {/* Left */}
        <Link href="/dashboard" className="flex flex-none items-center">
          <Image
            src="/verde.jpg"
            alt="Verde logo"
            width={36}
            height={36}
            className="h-9 w-12"
          />
        </Link>

        {/* Center */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative border px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-emerald-300 text-emerald-900"
                    : "border-transparent text-zinc-600 hover:text-zinc-950"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 -z-10 border border-emerald-300 bg-emerald-100"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="relative z-10 flex-none" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-10 flex h-10 w-10 items-center justify-center border border-zinc-950 bg-emerald-800 text-sm font-medium text-white transition hover:border-emerald-700 hover:bg-emerald-900"
          >
            {initial}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="absolute right-0 top-12 w-36 origin-top-right overflow-hidden border border-zinc-400 bg-white shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="block w-full cursor-pointer border-b-2 border-transparent px-4 py-3 text-left text-sm font-medium text-zinc-800 transition-colors hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
                >
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
