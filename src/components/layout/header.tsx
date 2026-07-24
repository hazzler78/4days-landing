"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

const navItems = [
  { href: "/#resa", label: "Resan" },
  { href: "/#varfor", label: "Varför vi" },
  { href: "/#hur-det-fungerar", label: "Så fungerar det" },
  { href: "/#kalkylator", label: "Kalkylator" },
  { href: "/#om-oss", label: "Om oss" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open || !isHome;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-slate-200/80 bg-white/95 text-brand shadow-sm backdrop-blur-xl"
          : "bg-transparent text-white"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={`${siteConfig.brand} – startsida`}
        >
          <Image
            src={solid ? "/bilder/logo-light.png" : "/bilder/logo-dark.png"}
            alt={siteConfig.brand}
            width={44}
            height={44}
            className="h-10 w-10 rounded-lg"
            priority
          />
          <div className="leading-tight">
            <p className={cn("text-sm font-semibold", solid ? "text-brand" : "text-white")}>
              4 Days <span className="text-accent">AI</span>
            </p>
            <p
              className={cn(
                "hidden text-xs sm:block",
                solid ? "text-slate-500" : "text-slate-300"
              )}
            >
              {siteConfig.slogan}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Huvudmeny">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent-dim",
                solid ? "text-slate-700" : "text-slate-200 hover:text-accent"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/#guide">Få guiden gratis</Link>
          </Button>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl border md:hidden",
              solid
                ? "border-slate-200 text-brand"
                : "border-white/15 text-white"
            )}
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className={cn(
            "border-t px-4 py-4 md:hidden",
            solid
              ? "border-slate-200 bg-white"
              : "border-white/10 bg-brand-dark/95"
          )}
        >
          <nav className="flex flex-col gap-3" aria-label="Mobilmeny">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-medium",
                  solid
                    ? "text-slate-800 hover:bg-slate-50"
                    : "text-slate-100 hover:bg-white/5"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="mt-2">
              <Link href="/#guide" onClick={() => setOpen(false)}>
                Få guiden gratis
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
