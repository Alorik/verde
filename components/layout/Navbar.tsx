"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";

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
  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  // Prevent background scrolling while mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const orgName = session?.user?.name ?? "";
  const initial = orgName.trim().charAt(0).toUpperCase() || "?";

  return (
    <>
      <header className="sticky top-0 z-50 h-16 border-b border-emerald-700/30 bg-white">
        <div className="mx-auto flex h-full max-w-full items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Left */}
          <Link
            href="/dashboard"
            className="flex flex-none items-center"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/verde.jpg"
              alt="Verde logo"
              width={36}
              height={36}
              className="h-9 w-12"
            />
          </Link>

          {/* Center — Desktop */}
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
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 -z-10 border border-emerald-300 bg-emerald-100"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center border border-emerald-800/40 bg-white text-zinc-900 transition-colors hover:border-emerald-700 hover:bg-emerald-50 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" strokeWidth={1.75} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Profile / Login */}
            <div className="relative z-10 flex-none" ref={profileRef}>
              {session ? (
                <>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((open) => !open)}
                    className="relative z-10 flex h-10 w-10 items-center justify-center border border-zinc-950 bg-emerald-800 text-sm font-medium text-white transition hover:border-emerald-700 hover:bg-emerald-900"
                  >
                    {initial}
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 24,
                        }}
                        className="absolute right-0 top-12 z-[9999] w-36 origin-top-right overflow-hidden border border-zinc-400 bg-white shadow-xl"
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
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex h-10 items-center justify-center border border-zinc-950 bg-zinc-950 px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:border-emerald-700 hover:bg-emerald-800"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-[2px] lg:hidden"
            />

            {/* Sliding panel */}
            <motion.aside
              ref={menuRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
                mass: 0.8,
              }}
              className="fixed inset-y-0 left-0 z-50 w-[min(86vw,380px)] border-r border-emerald-700/30 bg-white shadow-[8px_0_30px_rgba(6,78,59,0.12)] lg:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Mobile menu header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-emerald-700/30 px-4 sm:px-6">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center"
                  >
                    <Image
                      src="/verde.jpg"
                      alt="Verde logo"
                      width={36}
                      height={36}
                      className="h-9 w-12"
                    />
                  </Link>

                  <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-9 w-9 items-center justify-center border border-emerald-800/40 text-zinc-700 transition hover:border-emerald-700/30 hover:bg-emerald-50"
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                    Navigation
                  </p>

                  <div className="flex flex-col">
                    {NAV_ITEMS.map((item, index) => {
                      const isActive =
                        pathname === item.href ||
                        pathname?.startsWith(`${item.href}/`);

                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.045,
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={`group flex items-center justify-between border-b py-4 text-sm font-medium transition-colors ${
                              isActive
                                ? "border-emerald-300 bg-emerald-50 px-3 text-emerald-900"
                                : "border-zinc-200 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50 hover:px-3 hover:text-emerald-900"
                            }`}
                          >
                            <span>{item.label}</span>

                            <ChevronRight
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isActive
                                  ? "translate-x-0 text-emerald-700"
                                  : "text-zinc-300 group-hover:translate-x-1 group-hover:text-emerald-700"
                              }`}
                              strokeWidth={1.75}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </nav>

                {/* Mobile menu footer */}
                <div className="shrink-0 border-t border-emerald-700/30 px-4 py-5 sm:px-6">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                    ESG reporting, by design
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
