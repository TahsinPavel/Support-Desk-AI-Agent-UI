"use client";

import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext(null);

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState({
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

  const update = (obj: any) => setData({ ...data, ...obj });

  return (
    <OnboardingContext.Provider value={{ data, update }}>
      {children}
    </OnboardingContext.Provider>
  );
};
