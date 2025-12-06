"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaymentSkeleton } from "@/components/payment/PaymentSkeleton";
import { initializePaddle, openPaddleCheckout } from "@/lib/paddle";

export default function PaymentPage() {
  const router = useRouter();
  const [paddle, setPaddle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // In a real app, these would come from context or props
  const tenantEmail = "user@example.com";
  const tenantId = "tenant_123";
  const businessName = "Acme Inc.";
  
  // Initialize Paddle
  useEffect(() => {
    const initPaddle = async () => {
      try {
        const paddleInstance = await initializePaddle();
        setPaddle(paddleInstance);
      } catch (err) {
        setError("Failed to load payment processor. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    initPaddle();
  }, []);
  
  const handlePayment = () => {
    if (!paddle) {
      setError("Payment processor not loaded. Please refresh the page.");
      return;
    }
    
    try {
      openPaddleCheckout(
        paddle,
        process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID || "starter-price-id",
        tenantEmail,
        "/payment/success",
        tenantId
      );
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
      console.error(err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <PaymentSkeleton />
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Subscription</CardTitle>
          <CardDescription>
            Enter your payment details to activate your AI Support Desk account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Starter Plan</h3>
                <p className="text-sm text-muted-foreground">{businessName}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">$99<span className="text-sm font-normal">/month</span></p>
                <p className="text-sm text-muted-foreground">Billed monthly</p>
              </div>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div id="paddle-checkout-container"></div>
          
          <Button 
            onClick={handlePayment} 
            className="w-full"
            size="lg"
          >
            Enter Payment Details
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Your subscription will automatically renew monthly until cancelled.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}