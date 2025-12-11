"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only render the toggle button after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing on the server, and only render the actual button on the client
  if (!mounted) {
    return (
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
      >
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button placeholder */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
              <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                TogsTec AI
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-indigo-500">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-500">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-500">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Placeholder for theme toggle to maintain layout */}
            <div className="w-8 h-8 md:w-9 md:h-9" />
            <Button variant="ghost" asChild className="hidden sm:inline-flex text-xs md:text-sm">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild className="text-xs md:text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20">
              <Link href="/auth/signup">Subscribe Now</Link>
            </Button>
          </div>
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-14 md:h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
            <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              TogsTec AI
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-indigo-500">
            Home
          </Link>
          <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-500">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-500">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center space-x-2 md:space-x-3">
          <ThemeToggle />
          <Button variant="ghost" asChild className="hidden sm:inline-flex text-xs md:text-sm">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild className="text-xs md:text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20">
            <Link href="/auth/signup">Subscribe Now</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="container px-4 py-4 space-y-3">
              <Link 
                href="/" 
                className="block py-2 text-sm font-medium transition-colors hover:text-indigo-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="#features" 
                className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}