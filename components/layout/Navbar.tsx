"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
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
    <header className="sticky top-0 z-50 h-16 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-full max-w-full items-center justify-between px-8">
        {/* Left */}
        <Link href="/" className="flex items-center">
          <Image
            src="/verde.jpg"
            alt="Verde logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-cover"
          />
        </Link>

        {/* Right */}
        <div className="relative z-10" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white ring-2 ring-transparent transition hover:ring-emerald-200"
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
                className="absolute right-0 top-12 w-32 origin-top-right overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
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
