import AuthGuard from "@/components/AuthGuard";

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
