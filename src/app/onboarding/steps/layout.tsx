"use client";

import AuthGuard from "@/components/AuthGuard";
import { OnboardingProvider } from "@/components/OnboardingProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function StepsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OnboardingProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center p-6">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
            {children}
          </div>
        </div>
      </OnboardingProvider>
    </AuthGuard>
  );
}
