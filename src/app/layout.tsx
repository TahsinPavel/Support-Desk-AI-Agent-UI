import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <ThemeProvider
          defaultTheme="system"
          storageKey="ai-support-desk-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}