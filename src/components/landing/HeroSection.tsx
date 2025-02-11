
import { HeroBackground } from "./hero/HeroBackground";
import { HeroHeader } from "./hero/HeroHeader";
import { HeroFeatures } from "./hero/HeroFeatures";
import { HeroTrustSignals } from "./hero/HeroTrustSignals";
import { DownloadApp } from "@/components/dashboard/DownloadApp";
import { Footer } from "@/components/landing/Footer";

export function HeroSection() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative flex-1">
        <section className="relative overflow-hidden">
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
        </section>
      </div>
      <Footer />
    </div>
  );
}

