"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>
              Update your business information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" defaultValue="Acme Corporation" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-email">Email</Label>
              <Input id="business-email" type="email" defaultValue="contact@acme.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-phone">Phone</Label>
              <Input id="business-phone" type="tel" defaultValue="+1 (555) 123-4567" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              Connect third-party services to enhance your support desk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Twilio Integration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Twilio (SMS + Voice)</h3>
                  <p className="text-sm text-gray-500">Connect your Twilio account for SMS and voice capabilities</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio-account-sid">Account SID</Label>
                <Input id="twilio-account-sid" placeholder="Enter your Account SID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio-auth-token">Auth Token</Label>
                <Input id="twilio-auth-token" type="password" placeholder="Enter your Auth Token" />
              </div>
              <Button variant="outline">Save Twilio Settings</Button>
            </div>

            <Separator />

            {/* Brevo Integration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Brevo (Email)</h3>
                  <p className="text-sm text-gray-500">Connect your Brevo account for email capabilities</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brevo-api-key">API Key</Label>
                <Input id="brevo-api-key" placeholder="Enter your Brevo API Key" />
              </div>
              <Button variant="outline">Save Brevo Settings</Button>
            </div>

            <Separator />

            {/* Gemini API Integration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Gemini API Key</h3>
                  <p className="text-sm text-gray-500">Enable AI-powered assistance</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gemini-api-key">API Key</Label>
                <Input id="gemini-api-key" placeholder="Enter your Gemini API Key" />
              </div>
              <Button variant="outline">Save Gemini Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive email notifications for important events</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SMS Alerts</h3>
              <p className="text-sm text-gray-500">Receive SMS alerts for urgent matters</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">In-app Notifications</h3>
              <p className="text-sm text-gray-500">Show notifications within the application</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}