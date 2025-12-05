import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import {
  Hero,
  Features,
  HowItWorks,
  Industries,
  PricingTeaser,
  Testimonials,
  FinalCTA
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Industries />
        <PricingTeaser />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}