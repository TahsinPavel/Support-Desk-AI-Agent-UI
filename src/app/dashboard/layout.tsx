import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area - offset by sidebar width on desktop */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}