"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/OnboardingProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, DollarSign, Plus, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ServicesFaqStep() {
  const router = useRouter();
  const { data, addService, removeService, updateService, addFaq, removeFaq, updateFaq } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Transform data to match backend expected format
      const backendData = {
        business_name: data.business_name,
        industry: data.industry,
        phone_number: data.phone_number,
        website: "", // Add website field if needed
        channels: data.channels || [],
        greeting_message: data.greeting_message,
        tone_of_voice: data.tone_of_voice,
        business_hours: {
          open_time: data.business_hours?.open_time || "",
          close_time: data.business_hours?.close_time || "",
          timezone: data.business_hours?.timezone || ""
        },
        faq: data.faq || [],
        services: data.services || []
      };

      const response = await fetch("/api/tenant/setup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        },
        body: JSON.stringify(backendData),
      });

      if (response.ok) {
        // Mark business setup as complete in localStorage
        localStorage.setItem("business_setup_complete", "true");
        router.push("/payment");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Setup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting onboarding data: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const back = () => router.push("/onboarding/steps/Channels");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <HelpCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Services & FAQs</h1>
        <p className="text-gray-600 dark:text-gray-400">Final setup - configure your services and common questions</p>
      </div>

      {/* SERVICES SECTION */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Services</h2>
          </div>
          
          <div className="space-y-4">
            {data.services.map((service, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Service Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Service Name
                    </Label>
                    <Input
                      value={service.service}
                      onChange={(e) => updateService(index, "service", e.target.value)}
                      placeholder="e.g., Haircut, Consultation, Treatment"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Price
                    </Label>
                    <Input
                      value={service.price}
                      onChange={(e) => updateService(index, "price", e.target.value)}
                      placeholder="$149, Starting at $99, Free consultation"
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      disabled={data.services.length === 1}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={addService}
            className="mt-4 w-full border-dashed border-2 hover:border-green-300 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </CardContent>
      </Card>

      {/* FAQ SECTION */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {data.faq.map((faq, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Question */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Question
                    </Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      placeholder="What are your business hours?"
                    />
                  </div>

                  {/* Answer */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Answer
                    </Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      placeholder="We're open Monday-Friday 9AM-6PM..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Remove Button */}
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFaq(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    disabled={data.faq.length === 1}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove FAQ
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={addFaq}
            className="mt-4 w-full border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Tip:</strong> Add 5-10 common questions to help your AI agent provide accurate answers instantly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* NAVIGATION */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={back} className="px-6">
          ← Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="px-6 bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Setting up...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Setup →
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
