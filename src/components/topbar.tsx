"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/authApi";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Topbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/signin");
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6">
      {/* Left side - Search (hidden on mobile) */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Spacer for mobile */}
      <div className="flex-1 md:hidden pl-14" />

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Theme toggle - Using our custom ThemeToggle component */}
        {mounted && <ThemeToggle />}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-gray-200 dark:ring-neutral-700 hover:ring-blue-500 transition-all">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-medium">
                  U
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}