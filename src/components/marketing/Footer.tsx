"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 md:py-16 bg-muted/30">
      <div className="container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="sm:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
              <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                TogsTec AI
              </span>
            </div>
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
              AI-powered business automation for modern teams. Transform the way you operate.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Product</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><Link href="#features" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Integrations</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Company</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">About</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Legal</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-muted-foreground">
            © 2025 TogsTec AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">Twitter</Link>
            <Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">LinkedIn</Link>
            <Link href="#" className="text-muted-foreground hover:text-indigo-500 text-xs md:text-sm transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}