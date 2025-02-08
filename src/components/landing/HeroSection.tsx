
import { HeroBackground } from "./hero/HeroBackground";
import { HeroHeader } from "./hero/HeroHeader";
import { HeroFeatures } from "./hero/HeroFeatures";
import { HeroTrustSignals } from "./hero/HeroTrustSignals";
import { DownloadApp } from "@/components/dashboard/DownloadApp";
import { Footer } from "@/components/landing/Footer";

export function HeroSection() {
  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-b from-background via-purple-900/10 to-background">
      {/* Animated background elements */}
      <HeroBackground />

      <div className="container relative z-10 mx-auto px-4">
        <HeroHeader />
        <HeroFeatures />
      </div>

      <HeroTrustSignals />

      <div className="relative">
        <div className="absolute inset-0 bg-[#9b87f5]/5 dark:bg-[#D6BCFA]/5 transform -skew-y-3" />
        <div className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-16 sm:py-24">
            <DownloadApp />
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
