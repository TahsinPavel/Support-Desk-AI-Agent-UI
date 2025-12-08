"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get parameters from URL
  const subscriptionId = searchParams.get('subscription_id');
  const customerId = searchParams.get('customer_id');
  const email = searchParams.get('email') || '';
  
  // In a real app, this would come from context or authentication
  const tenantId = "tenant_123";
  
  useEffect(() => {
    const activateSubscription = async () => {
      if (!subscriptionId || !customerId) {
        setError("Missing subscription information. Please contact support.");
        setLoading(false);
        return;
      }
      
      try {
        // Call backend to activate subscription
        const response = await fetch('/api/subscription/activate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            paddle_customer_id: customerId,
            paddle_subscription_id: subscriptionId,
            plan: "starter",
            tenant_id: tenantId
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to activate subscription');
        }
        
        // Mark payment as complete in localStorage
        localStorage.setItem("payment_complete", "true");
        
        // Redirect to dashboard after successful activation
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (err) {
        setError("Failed to activate your subscription. Please contact support.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    activateSubscription();
  }, [subscriptionId, customerId, email, router, tenantId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold">Processing your payment...</h2>
            <p className="text-muted-foreground mt-2">
              Please wait while we activate your subscription.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Subscription Activation Failed</CardTitle>
            <CardDescription>
              We couldn't activate your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => router.push('/payment')} 
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold">Payment Successful!</h2>
          <p className="text-muted-foreground mt-2">
            Your subscription has been activated.
          </p>
          <p className="text-muted-foreground mt-4">
            Redirecting to your dashboard...
          </p>
          <Button 
            onClick={() => router.push('/dashboard')} 
            className="mt-6 w-full"
            variant="outline"
          >
            Go to Dashboard Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}