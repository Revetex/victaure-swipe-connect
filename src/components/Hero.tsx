import { motion } from "framer-motion";
import { HeroBackground } from "./hero/HeroBackground";
import { HeroContent } from "./hero/HeroContent";
import { HeroDecorations } from "./hero/HeroDecorations";

export function HeroSection() {
  return (
    <section className="relative mobile-height flex flex-col items-center justify-center overflow-hidden safari-fix">
      <div className="responsive-container relative z-10">
        <HeroBackground />
        <HeroContent />
        <HeroDecorations />
      </div>
    </section>
  );
}