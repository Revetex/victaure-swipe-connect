import { HeroSection } from "@/components/Hero";
import { Features } from "@/components/Features";

export default function Index() {
  return (
    <div className="min-h-screen bg-background font-montserrat">
      <HeroSection />
      <Features />
    </div>
  );
}