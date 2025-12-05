"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-16 bg-muted/30">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                TogsTec AI
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AI-powered business automation for modern teams. Transform the way you operate.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Integrations</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">About</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 TogsTec AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">Twitter</Link>
            <Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">LinkedIn</Link>
            <Link href="#" className="text-muted-foreground hover:text-indigo-500 text-sm transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}