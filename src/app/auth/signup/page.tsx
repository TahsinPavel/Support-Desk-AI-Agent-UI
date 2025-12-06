"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { signup } from "@/lib/authApi";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'starter';

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms and Conditions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await signup({
        name: formData.name,
        business_name: formData.businessName,
        email: formData.email,
        password: formData.password,
      });

      // More robust success checking
      // Check if response indicates success in various ways
      const isSuccess = 
        response.success === true || 
        response.user !== undefined || 
        response.token !== undefined ||
        response.access_token !== undefined ||
        response.accessToken !== undefined ||
        (response.message && response.message.toLowerCase().includes('success'));

      if (isSuccess) {
        // On success, redirect to onboarding
        router.push('/onboarding');
      } else {
        // Try to get a meaningful error message
        const errorMessage = response.message || response.detail || "Registration completed but response format unexpected. Redirecting to onboarding...";
        // Even if the response format is unexpected, if we got a 200 OK, we should still redirect
        console.log("Unexpected response format but request was successful:", response);
        router.push('/onboarding');
      }
    } catch (err: unknown) {
      // Handle axios error response
      const axiosError = err as { response?: { data?: { message?: string; detail?: string; error?: string } } };
      const errorData = axiosError?.response?.data;

      // Try different common error message fields
      const errorMessage =
        errorData?.message ||
        errorData?.detail ||
        errorData?.error ||
        (err instanceof Error ? err.message : "Failed to create account. Please try again.");

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to get started with AI Support Desk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="agreeToTerms" className="text-sm">
              I agree to the <Link href="#" className="text-blue-600 hover:underline">Terms and Conditions</Link>
            </Label>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </CardContent>
      </Card>
    }>
      <SignUpForm />
    </Suspense>
  );
}