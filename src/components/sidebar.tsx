"use client";

import Link from "next/link";
import { Home, Phone, Mail, MessageCircle, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold px-2">AI Support Desk</h1>

      <nav className="flex flex-col gap-2">
        <Link className="nav-item" href="/dashboard">Dashboard</Link>
        <Link className="nav-item" href="/sms">SMS</Link>
        <Link className="nav-item" href="/voice">Voice</Link>
        <Link className="nav-item" href="/email">Email</Link>
        <Link className="nav-item" href="/chat">Chat</Link>
        <Link className="nav-item" href="/settings">Settings</Link>
      </nav>
    </aside>
  );
}
