"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/OnboardingProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Globe } from "lucide-react";

export default function BusinessHoursStep() {
  const router = useRouter();
  const { data, update } = useOnboarding();

  const next = () => router.push("/onboarding/steps/Channels");
  const back = () => router.push("/onboarding");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Clock className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Business Hours</h1>
        <p className="text-gray-600 dark:text-gray-400">Set your operating hours and timezone</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Open Time */}
            <div className="space-y-2">
              <Label htmlFor="open_time" className="text-sm font-medium text-gray-700">
                Open Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="open_time"
                  type="time"
                  value={data.business_hours.open_time}
                  onChange={(e) =>
                    update({ 
                      business_hours: { 
                        ...data.business_hours, 
                        open_time: e.target.value 
                      } 
                    })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            {/* Close Time */}
            <div className="space-y-2">
              <Label htmlFor="close_time" className="text-sm font-medium text-gray-700">
                Close Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="close_time"
                  type="time"
                  value={data.business_hours.close_time}
                  onChange={(e) =>
                    update({ 
                      business_hours: { 
                        ...data.business_hours, 
                        close_time: e.target.value 
                      } 
                    })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">
                Timezone
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="timezone"
                  placeholder="America/New_York"
                  value={data.business_hours.timezone}
                  onChange={(e) =>
                    update({ 
                      business_hours: { 
                        ...data.business_hours, 
                        timezone: e.target.value 
                      } 
                    })
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Your AI agent will use these hours to determine when to respond immediately vs. when to schedule follow-ups.
            </p>
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
