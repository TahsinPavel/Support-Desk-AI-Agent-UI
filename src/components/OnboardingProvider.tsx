"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingData {
  business_name: string;
  industry: string;
  phone_number: string;
  tone_of_voice: string;
  greeting_message: string;
  business_hours: {
    open_time: string;
    close_time: string;
    timezone: string;
  };
  channels: Array<{
    type: string;
    identifier: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  services: Array<{
    service: string;
    price: string;
  }>;
}

interface OnboardingContextType {
  data: OnboardingData;
  update: (updates: Partial<OnboardingData>) => void;
  updateChannel: (index: number, field: "type" | "identifier", value: string) => void;
  addChannel: () => void;
  removeChannel: (index: number) => void;
  updateFaq: (index: number, field: "question" | "answer", value: string) => void;
  addFaq: () => void;
  removeFaq: (index: number) => void;
  updateService: (index: number, field: "service" | "price", value: string) => void;
  addService: () => void;
  removeService: (index: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>({
    business_name: "",
    industry: "",
    phone_number: "",
    tone_of_voice: "Friendly",
    greeting_message: "",
    business_hours: {
      open_time: "",
      close_time: "",
      timezone: "America/New_York"
    },
    channels: [{ type: "phone", identifier: "" }],
    faq: [{ question: "", answer: "" }],
    services: [{ service: "", price: "" }]
  });

  const update = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const updateChannel = (index: number, field: "type" | "identifier", value: string) => {
    setData(prev => ({
      ...prev,
      channels: prev.channels.map((channel, i) =>
        i === index ? { ...channel, [field]: value } : channel
      )
    }));
  };

  const addChannel = () => {
    setData(prev => ({
      ...prev,
      channels: [...prev.channels, { type: "phone", identifier: "" }]
    }));
  };

  const removeChannel = (index: number) => {
    setData(prev => ({
      ...prev,
      channels: prev.channels.filter((_, i) => i !== index)
    }));
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    setData(prev => ({
      ...prev,
      faq: prev.faq.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addFaq = () => {
    setData(prev => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }]
    }));
  };

  const removeFaq = (index: number) => {
    setData(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
    }));
  };

  const updateService = (index: number, field: "service" | "price", value: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addService = () => {
    setData(prev => ({
      ...prev,
      services: [...prev.services, { service: "", price: "" }]
    }));
  };

  const removeService = (index: number) => {
    setData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  return (
    <OnboardingContext.Provider value={{
      data,
      update,
      updateChannel,
      addChannel,
      removeChannel,
      updateFaq,
      addFaq,
      removeFaq,
      updateService,
      addService,
      removeService
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};
