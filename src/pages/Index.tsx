import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { DownloadApp } from "@/components/dashboard/DownloadApp";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/50">
      <HeroSection />
      <FeaturesSection />
      <div className="container mx-auto px-4 py-12">
        <DownloadApp />
      </div>
      <CTASection />
      <Footer />
    </div>
  );
}