import { motion } from "framer-motion";
import { HeroBackground } from "./hero/HeroBackground";
import { HeroContent } from "./hero/HeroContent";
import { HeroDecorations } from "./hero/HeroDecorations";
import { getViewportHeight } from "@/utils/viewport";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [viewportHeight, setViewportHeight] = useState(getViewportHeight());

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(getViewportHeight());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <section 
      className="relative flex flex-col items-center justify-center overflow-hidden safari-fix"
      style={{ minHeight: `${viewportHeight}px` }}
    >
      <div className="responsive-container relative z-10">
        <HeroBackground />
        <HeroContent />
        <HeroDecorations />
      </div>
    </section>
  );
}