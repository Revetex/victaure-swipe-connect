import { motion } from "framer-motion";
import { HeroBackground } from "./hero/HeroBackground";
import { HeroContent } from "./hero/HeroContent";
import { HeroDecorations } from "./hero/HeroDecorations";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <HeroBackground />
      <HeroContent />
      <HeroDecorations />
    </section>
  );
}