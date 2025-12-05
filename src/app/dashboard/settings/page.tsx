"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building2, Key, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Profile */}
        <Card className="rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Business Profile</CardTitle>
                <CardDescription>
                  Update your business information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name" className="text-sm font-medium">Business Name</Label>
              <Input id="business-name" defaultValue="Acme Corporation" className="bg-gray-50 dark:bg-neutral-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-email" className="text-sm font-medium">Email</Label>
              <Input id="business-email" type="email" defaultValue="contact@acme.com" className="bg-gray-50 dark:bg-neutral-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-phone" className="text-sm font-medium">Phone</Label>
              <Input id="business-phone" type="tel" defaultValue="+1 (555) 123-4567" className="bg-gray-50 dark:bg-neutral-800" />
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Integrations</CardTitle>
                <CardDescription>
                  Connect third-party services
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Twilio Integration */}
            <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Twilio (SMS + Voice)</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Connect for SMS and voice</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio-account-sid" className="text-sm">Account SID</Label>
                <Input id="twilio-account-sid" placeholder="Enter your Account SID" className="bg-white dark:bg-neutral-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio-auth-token" className="text-sm">Auth Token</Label>
                <Input id="twilio-auth-token" type="password" placeholder="Enter your Auth Token" className="bg-white dark:bg-neutral-800" />
              </div>
              <Button variant="outline" size="sm">Save Twilio Settings</Button>
            </div>

            {/* Brevo Integration */}
            <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Brevo (Email)</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Connect for email capabilities</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brevo-api-key" className="text-sm">API Key</Label>
                <Input id="brevo-api-key" placeholder="Enter your Brevo API Key" className="bg-white dark:bg-neutral-800" />
              </div>
              <Button variant="outline" size="sm">Save Brevo Settings</Button>
            </div>

            {/* Gemini API Integration */}
            <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Gemini API</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enable AI-powered assistance</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gemini-api-key" className="text-sm">API Key</Label>
                <Input id="gemini-api-key" placeholder="Enter your Gemini API Key" className="bg-white dark:bg-neutral-800" />
              </div>
              <Button variant="outline" size="sm">Save Gemini Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Preferences */}
      <Card className="rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive email notifications for important events</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">SMS Alerts</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive SMS alerts for urgent matters</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">In-app Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Show notifications within the application</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}