"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaymentSkeleton } from "@/components/payment/PaymentSkeleton";
import { initializePaddle, openPaddleCheckout } from "@/lib/paddle";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  paddle_price_id?: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const [paddle, setPaddle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paddleInitialized, setPaddleInitialized] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [pricingPlan, setPricingPlan] = useState<PricingPlan | null>(null);

  // Initialize Paddle only when user clicks payment button
  const initializePaddleWhenNeeded = async () => {
    if (paddleInitialized) return paddle;

    setLoading(true);
    try {
      const paddleInstance = await initializePaddle();
      setPaddle(paddleInstance);
      setPaddleInitialized(true);
      return paddleInstance;
    } catch (err) {
      setError("Failed to load payment processor. Please try again.");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data and pricing plans on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          router.push("/auth/signin");
          return;
        }

        // Fetch user data
        const userResponse = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const user = await userResponse.json();
          setUserData(user);
        } else {
          setError("Failed to load user information");
        }

        // Fetch pricing plans
        const pricingResponse = await fetch("/api/pricing/plans");
        if (pricingResponse.ok) {
          const plans = await pricingResponse.json();
          // Get the first available plan (starter plan)
          if (plans && plans.length > 0) {
            setPricingPlan(plans[0]);
          }
        } else {
          // Fallback to default plan if API fails
          setPricingPlan({
            id: "starter",
            name: "Starter AI",
            price: 149,
            currency: "USD",
            interval: "month",
            features: [
              "AI Chat, Email, SMS & Voice agent",
              "Basic analytics",
              "1 knowledge base source",
              "Mobile-friendly inbox",
              "1 phone number connector",
              "1 support email connector",
              "Unlimited inbound messages"
            ],
            paddle_price_id: "pri_starter_monthly"
          });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load information");
        // Set fallback pricing plan
        setPricingPlan({
          id: "starter",
          name: "Starter AI",
          price: 149,
          currency: "USD",
          interval: "month",
          features: [
            "AI Chat, Email, SMS & Voice agent",
            "Basic analytics",
            "1 knowledge base source",
            "Mobile-friendly inbox",
            "1 phone number connector",
            "1 support email connector",
            "Unlimited inbound messages"
          ],
          paddle_price_id: "pri_starter_monthly"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handlePayment = async () => {
    console.log("Payment button clicked - routing to dashboard");
    
    // Set payment as complete since we're skipping payment for now
    localStorage.setItem("payment_complete", "true");
    
    // Commented out Paddle payment logic - will use when Paddle is setup
    /*
    const paddleInstance = paddle || await initializePaddleWhenNeeded();

    if (!paddleInstance) {
      setError("Payment processor not loaded. Please refresh the page.");
      return;
    }

    if (!userData) {
      setError("User information not available");
      return;
    }

    if (!pricingPlan) {
      setError("Pricing plan not available");
      return;
    }

    try {
      openPaddleCheckout(
        paddleInstance,
        pricingPlan.paddle_price_id || "starter-price-id",
        userData.email || "user@example.com",
        "/payment/success",
        userData.id || "tenant_123"
      );
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
      console.error(err);
    }
    */

    // Temporary: Route to dashboard since Paddle is not setup
    router.push("/dashboard");
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
                <h3 className="font-semibold">{pricingPlan?.name || 'Starter Plan'}</h3>
                <p className="text-sm text-muted-foreground">{userData?.business_name || 'Your Business'}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {pricingPlan ? `${pricingPlan.currency} ${pricingPlan.price}` : '$99'}
                  <span className="text-sm font-normal">/{pricingPlan?.interval || 'month'}</span>
                </p>
                <p className="text-sm text-muted-foreground">Billed {pricingPlan?.interval || 'monthly'}</p>
              </div>
            </div>
            {pricingPlan?.features && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Features included:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {pricingPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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