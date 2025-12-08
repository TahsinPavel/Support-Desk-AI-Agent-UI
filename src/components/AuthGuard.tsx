"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface AuthGuardProps {
  children: React.ReactNode;
  requireBusinessSetup?: boolean;
  requirePayment?: boolean;
}

export default function AuthGuard({ children, requireBusinessSetup = false, requirePayment = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userStatus, setUserStatus] = useState({
    hasCompletedBusinessSetup: false,
    hasCompletedPayment: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      // Add small delay to ensure token is stored after signup/login
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          // Redirect to signin if accessing protected routes
          if (pathname.startsWith('/onboarding') || pathname.startsWith('/payment') || pathname.startsWith('/dashboard')) {
            router.push("/auth/signin");
            return;
          }
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Check localStorage for completion status first
        const businessSetupComplete = localStorage.getItem("business_setup_complete") === "true";
        const paymentComplete = localStorage.getItem("payment_complete") === "true";

        setUserStatus({
          hasCompletedBusinessSetup: businessSetupComplete,
          hasCompletedPayment: paymentComplete
        });

        // Try to verify with backend, but don't fail if it doesn't work
        try {
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUserStatus({
              hasCompletedBusinessSetup: userData.has_completed_business_setup || businessSetupComplete,
              hasCompletedPayment: userData.has_completed_payment || paymentComplete
            });
          }
        } catch (backendError) {
          console.log("Backend auth check failed, using localStorage:", backendError);
          // Continue with localStorage values
        }

        // Handle routing logic based on user status
        if (pathname.startsWith('/auth/')) {
          // User is authenticated, redirect from auth pages to appropriate step
          if (!businessSetupComplete) {
            router.push("/onboarding");
            return;
          } else if (!paymentComplete) {
            router.push("/payment");
            return;
          } else {
            router.push("/dashboard");
            return;
          }
        } else if (pathname.startsWith('/onboarding')) {
          // Check if user should be on onboarding
          if (businessSetupComplete) {
            if (!paymentComplete) {
              router.push("/payment");
            } else {
              router.push("/dashboard");
            }
            return;
          }
        } else if (pathname.startsWith('/payment')) {
          // Check if user should be on payment
          if (!businessSetupComplete) {
            router.push("/onboarding");
            return;
          } else if (paymentComplete) {
            router.push("/dashboard");
            return;
          }
        } else if (pathname.startsWith('/dashboard')) {
          // Check if user should be on dashboard
          if (!businessSetupComplete) {
            router.push("/onboarding");
            return;
          } else if (!paymentComplete) {
            router.push("/payment");
            return;
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("auth_token");
        // Only redirect to signin if accessing protected routes
        if (pathname.startsWith('/onboarding') || pathname.startsWith('/payment') || pathname.startsWith('/dashboard')) {
          router.push("/auth/signin");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-center mt-4 text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For public routes (auth pages), allow access
  if (pathname.startsWith('/auth/')) {
    if (isAuthenticated) {
      return null; // Will redirect
    }
    return <>{children}</>;
  }

  // For protected routes, check authentication
  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
