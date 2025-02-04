import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";
import { DownloadApp } from "@/components/dashboard/DownloadApp";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 dark:from-dark-purple dark:via-dark-purple/95 dark:to-dark-purple/90">
      <div className="relative z-10">
        <HeroSection />
        <div className="relative">
          <div className="absolute inset-0 bg-[#9b87f5]/5 dark:bg-[#D6BCFA]/5 transform -skew-y-3" />
          <FeaturesSection />
        </div>
        <div className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-16 sm:py-24">
            <DownloadApp />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}