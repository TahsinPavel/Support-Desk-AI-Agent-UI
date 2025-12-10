"use client";

import { createContext, useContext, useState } from "react";

interface OnboardingData {
  business_name: string;
  industry: string;
  phone_number: string;
  greeting_message: string;
  tone_of_voice: string;
  business_hours: { 
    open_time: string; 
    close_time: string; 
    timezone: string; 
  };
  channels: { 
    type: string; 
    identifier: string; 
  }[];
  faq: { 
    question: string; 
    answer: string; 
  }[];
  services: { 
    service: string; 
    price: string; 
  }[];
}

interface OnboardingContextType {
  data: OnboardingData;
  update: (obj: Partial<OnboardingData>) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<OnboardingData>({
    business_name: "",
    industry: "",
    phone_number: "",
    greeting_message: "",
    tone_of_voice: "",
    business_hours: { open_time: "", close_time: "", timezone: "" },
    channels: [{ type: "phone", identifier: "" }],
    faq: [{ question: "", answer: "" }],
    services: [{ service: "", price: "" }],
  });

  const update = (obj: Partial<OnboardingData>) => setData({ ...data, ...obj });

  return (
    <OnboardingContext.Provider value={{ data, update }}>
      {children}
    </OnboardingContext.Provider>
  );
};