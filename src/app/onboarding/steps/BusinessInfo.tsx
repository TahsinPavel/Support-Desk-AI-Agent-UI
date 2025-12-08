"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/OnboardingProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function BusinessInfoStep() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.business_name.trim()) {
      newErrors.business_name = "Business name is required";
    }
    if (!data.industry.trim()) {
      newErrors.industry = "Industry is required";
    }
    if (!data.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(data.phone_number)) {
      newErrors.phone_number = "Invalid phone number format";
    }
    if (!data.greeting_message.trim()) {
      newErrors.greeting_message = "Greeting message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validate()) {
      router.push("/onboarding/steps/BusinessHours");
    }
  };

  const back = () => {
    router.push("/");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Building2 className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Business Information</h1>
        <p className="text-gray-600 dark:text-gray-400">Tell us about your business to get started</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="business_name" className="text-sm font-medium text-gray-700">
                Business Name *
              </Label>
              <Input
                id="business_name"
                value={data.business_name}
                onChange={(e) => update({ business_name: e.target.value })}
                placeholder="Acme Inc."
                className={errors.business_name ? "border-red-500" : ""}
              />
              {errors.business_name && (
                <p className="text-sm text-red-600">{errors.business_name}</p>
              )}
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                Industry *
              </Label>
              <Input
                id="industry"
                value={data.industry}
                onChange={(e) => update({ industry: e.target.value })}
                placeholder="e.g., Medical Spa, Auto Repair, Salon"
                className={errors.industry ? "border-red-500" : ""}
              />
              {errors.industry && (
                <p className="text-sm text-red-600">{errors.industry}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone_number"
                  value={data.phone_number}
                  onChange={(e) => update({ phone_number: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className={`pl-10 ${errors.phone_number ? "border-red-500" : ""}`}
                />
              </div>
              {errors.phone_number && (
                <p className="text-sm text-red-600">{errors.phone_number}</p>
              )}
            </div>

            {/* Tone of Voice */}
            <div className="space-y-2">
              <Label htmlFor="tone_of_voice" className="text-sm font-medium text-gray-700">
                Tone of Voice
              </Label>
              <Select value={data.tone_of_voice} onValueChange={(value) => update({ tone_of_voice: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Warm">Warm</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Greeting Message */}
          <div className="mt-6 space-y-2">
            <Label htmlFor="greeting_message" className="text-sm font-medium text-gray-700">
              Greeting Message *
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="greeting_message"
                value={data.greeting_message}
                onChange={(e) => update({ greeting_message: e.target.value })}
                placeholder="Hello! How can I help you today?"
                className={`pl-10 min-h-[100px] ${errors.greeting_message ? "border-red-500" : ""}`}
              />
            </div>
            {errors.greeting_message && (
              <p className="text-sm text-red-600">{errors.greeting_message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={back} className="px-6">
          ← Back
        </Button>
        <Button onClick={next} className="px-6">
          Continue →
        </Button>
      </div>
    </div>
  );
}
