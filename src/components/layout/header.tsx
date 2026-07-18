"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

const navItems = [
  { href: "#varfor", label: "Varför vi" },
  { href: "#hur-det-fungerar", label: "Så fungerar det" },
  { href: "#kalkylator", label: "Kalkylator" },
  { href: "#om-oss", label: "Om oss" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-brand-dark/90 backdrop-blur-xl shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={`${siteConfig.brand} – startsida`}
        >
          <Image
            src="/bilder/logo-dark.png"
            alt={siteConfig.brand}
            width={44}
            height={44}
            className="h-10 w-10 rounded-lg"
            priority
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">
              4 Days <span className="text-accent">AI</span>
            </p>
            <p className="hidden text-xs text-slate-300 sm:block">
              {siteConfig.slogan}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Huvudmeny">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-200 transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#guide">Få guiden gratis</a>
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white md:hidden"
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-brand-dark/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobilmeny">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="mt-2">
              <a href="#guide" onClick={() => setOpen(false)}>
                Få guiden gratis
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
