"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, BarChart3 } from "lucide-react";

interface HeaderProps {
  userEmail?: string;
}

export function Header({ userEmail }: HeaderProps) {
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "4D";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-brand-primary px-4 text-white">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent font-bold text-brand-primary text-sm">
            4D
          </div>
          <div className="hidden sm:block">
            <span className="font-semibold">4days.ai</span>
            <span className="ml-2 text-brand-accent/90 text-sm">Knowledge Agent</span>
          </div>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-1">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className={`text-white hover:bg-white/10 ${pathname === "/" ? "bg-white/10" : ""}`}
          >
            Chat
          </Button>
        </Link>
        <Link href="/admin">
          <Button
            variant="ghost"
            size="sm"
            className={`text-white hover:bg-white/10 ${pathname === "/admin" ? "bg-white/10" : ""}`}
          >
            <BarChart3 className="mr-1 h-4 w-4" />
            Admin
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            variant="ghost"
            size="sm"
            className={`text-white hover:bg-white/10 ${pathname === "/settings" ? "bg-white/10" : ""}`}
          >
            <Settings className="mr-1 h-4 w-4" />
            Inställningar
          </Button>
        </Link>
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand-accent text-brand-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {userEmail && (
            <>
              <div className="px-2 py-1.5 text-sm text-muted-foreground truncate max-w-[200px]">
                {userEmail}
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem asChild className="md:hidden">
            <Link href="/admin">Admin</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="md:hidden">
            <Link href="/settings">Inställningar</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logga ut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
