"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  MessageSquare, 
  Phone, 
  Mail, 
  MessageCircle,
  Bot,
  Clock
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    industry: "",
    phoneNumber: "",
    website: ""
  });
  
  const [channels, setChannels] = useState({
    sms: false,
    voice: false,
    email: false,
    chat: false
  });
  
  const [integrations, setIntegrations] = useState({
    twilioSid: "",
    twilioToken: "",
    emailProvider: "",
    chatWidgetScript: ""
  });
  
  const [aiAgent, setAiAgent] = useState({
    agentName: "",
    greeting: "",
    tone: "friendly",
    businessHours: "",
    faqs: ""
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit onboarding data
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // In a real app, this would be an API call:
      // const response = await fetch('/api/tenant/setup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     businessInfo,
      //     channels,
      //     integrations,
      //     aiAgent
      //   })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On success, redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error("Failed to complete onboarding", err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Business Information</h2>
              <p className="text-muted-foreground">
                Tell us about your business to get started
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessInfo.businessName}
                  onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                  placeholder="Acme Inc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={businessInfo.industry}
                  onChange={(e) => setBusinessInfo({...businessInfo, industry: e.target.value})}
                  placeholder="e.g., Medical Spa, Auto Repair, Salon"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={businessInfo.phoneNumber}
                  onChange={(e) => setBusinessInfo({...businessInfo, phoneNumber: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={businessInfo.website}
                  onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Communication Channels</h2>
              <p className="text-muted-foreground">
                Select which channels you'd like to enable for your AI agent
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  channels.sms ? "border-blue-500 bg-blue-50" : "hover:bg-muted"
                }`}
                onClick={() => setChannels({...channels, sms: !channels.sms})}
              >
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium">SMS</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Enable text messaging support
                </p>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  channels.voice ? "border-blue-500 bg-blue-50" : "hover:bg-muted"
                }`}
                onClick={() => setChannels({...channels, voice: !channels.voice})}
              >
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">Voice Calls</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Enable phone call support
                </p>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  channels.email ? "border-blue-500 bg-blue-50" : "hover:bg-muted"
                }`}
                onClick={() => setChannels({...channels, email: !channels.email})}
              >
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="font-medium">Email</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Enable email support
                </p>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  channels.chat ? "border-blue-500 bg-blue-50" : "hover:bg-muted"
                }`}
                onClick={() => setChannels({...channels, chat: !channels.chat})}
              >
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-medium">Chat Widget</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Enable website chat support
                </p>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Connect Your Services</h2>
              <p className="text-muted-foreground">
                Integrate with your communication providers
              </p>
            </div>
            
            <div className="space-y-6">
              {(channels.sms || channels.voice) && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center">
                    <Phone className="h-5 w-5 text-green-500 mr-2" />
                    Twilio Integration
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="twilioSid">Twilio SID</Label>
                    <Input
                      id="twilioSid"
                      value={integrations.twilioSid}
                      onChange={(e) => setIntegrations({...integrations, twilioSid: e.target.value})}
                      placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilioToken">Twilio Auth Token</Label>
                    <Input
                      id="twilioToken"
                      type="password"
                      value={integrations.twilioToken}
                      onChange={(e) => setIntegrations({...integrations, twilioToken: e.target.value})}
                      placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    />
                  </div>
                </div>
              )}
              
              {channels.email && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center">
                    <Mail className="h-5 w-5 text-purple-500 mr-2" />
                    Email Provider
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="emailProvider">SMTP Settings or Brevo API Key</Label>
                    <Textarea
                      id="emailProvider"
                      value={integrations.emailProvider}
                      onChange={(e) => setIntegrations({...integrations, emailProvider: e.target.value})}
                      placeholder="Enter your SMTP settings or Brevo API key"
                      rows={3}
                    />
                  </div>
                </div>
              )}
              
              {channels.chat && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center">
                    <MessageCircle className="h-5 w-5 text-yellow-500 mr-2" />
                    Chat Widget Script
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="chatWidgetScript">JavaScript Snippet</Label>
                    <Textarea
                      id="chatWidgetScript"
                      value={integrations.chatWidgetScript}
                      onChange={(e) => setIntegrations({...integrations, chatWidgetScript: e.target.value})}
                      placeholder="Paste your chat widget JavaScript code here"
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Bot className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">AI Agent Personality</h2>
              <p className="text-muted-foreground">
                Customize how your AI agent interacts with customers
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agentName">Agent Name</Label>
                <Input
                  id="agentName"
                  value={aiAgent.agentName}
                  onChange={(e) => setAiAgent({...aiAgent, agentName: e.target.value})}
                  placeholder="e.g., Support Assistant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="greeting">Greeting Message</Label>
                <Textarea
                  id="greeting"
                  value={aiAgent.greeting}
                  onChange={(e) => setAiAgent({...aiAgent, greeting: e.target.value})}
                  placeholder="Hello! How can I help you today?"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">Tone of Voice</Label>
                <select
                  id="tone"
                  className="w-full p-2 border rounded-md"
                  value={aiAgent.tone}
                  onChange={(e) => setAiAgent({...aiAgent, tone: e.target.value})}
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessHours">Business Hours</Label>
                <Input
                  id="businessHours"
                  value={aiAgent.businessHours}
                  onChange={(e) => setAiAgent({...aiAgent, businessHours: e.target.value})}
                  placeholder="e.g., Mon-Fri 9AM-6PM PST"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="faqs">Frequently Asked Questions</Label>
                <Textarea
                  id="faqs"
                  value={aiAgent.faqs}
                  onChange={(e) => setAiAgent({...aiAgent, faqs: e.target.value})}
                  placeholder="List common questions and answers to help train your AI agent"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Setup Wizard</CardTitle>
            <CardDescription>
              Complete these steps to configure your AI Support Desk
            </CardDescription>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of 4
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Business Info</span>
          <span>Channels</span>
          <span>Integrations</span>
          <span>AI Agent</span>
        </div>
      </CardHeader>
      
      <CardContent className="py-6">
        {renderStep()}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={
            (currentStep === 1 && !businessInfo.businessName) ||
            (currentStep === 4 && !aiAgent.agentName)
          }
        >
          {currentStep === 4 ? "Complete Setup" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}