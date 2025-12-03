"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <div className="text-lg font-semibold">Welcome</div>

      <div className="flex items-center gap-4">
        <Button variant="outline">Switch Tenant</Button>
        <Avatar />
      </div>
    </header>
  );
}
