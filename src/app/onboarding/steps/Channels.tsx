"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/OnboardingProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Phone, Mail, MessageCircle } from "lucide-react";

const channelOptions = [
  { id: 'chat', name: 'Live Chat', icon: MessageSquare, description: 'Real-time chat support' },
  { id: 'phone', name: 'Phone Calls', icon: Phone, description: 'Voice call support' },
  { id: 'sms', name: 'SMS Text', icon: MessageCircle, description: 'Text message support' },
  { id: 'email', name: 'Email', icon: Mail, description: 'Email support' }
];

export default function ChannelsStep() {
  const router = useRouter();
  const { data, update } = useOnboarding();

  const toggleChannel = (channelId: string) => {
    const currentChannels = data.channels || [];
    const isSelected = currentChannels.some(channel => channel.type === channelId);
    
    if (isSelected) {
      // Remove channel
      const updatedChannels = currentChannels.filter(channel => channel.type !== channelId);
      update({ channels: updatedChannels });
    } else {
      // Add channel
      const updatedChannels = [...currentChannels, { type: channelId, identifier: '' }];
      update({ channels: updatedChannels });
    }
  };

  const next = () => router.push("/onboarding/steps/ServicesFaq");
  const back = () => router.push("/onboarding");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Communication Channels</h1>
        <p className="text-gray-600 dark:text-gray-400">Select the channels you want to offer support</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channelOptions.map((channel) => {
              const Icon = channel.icon;
              const isSelected = data.channels?.some(c => c.type === channel.id);
              
              return (
                <div
                  key={channel.id}
                  onClick={() => toggleChannel(channel.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Select all the channels you want to support. You can configure specific settings for each channel later in your dashboard.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={back} className="px-6">
          ← Back
        </Button>
        <Button 
          onClick={next} 
          className="px-6 bg-blue-600 hover:bg-blue-700"
          disabled={!data.channels || data.channels.length === 0}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
