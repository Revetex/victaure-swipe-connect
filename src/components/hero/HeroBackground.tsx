import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isSafari } from "@/utils/viewport";

export function HeroBackground() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [particleCount, setParticleCount] = useState(50);

  useEffect(() => {
    setParticleCount(isSafari() ? 25 : 50);
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_1000px_at_50%_-100px,#7c3aed,transparent)]"
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />

      {!isReducedMotion && (
        <div className="absolute inset-0">
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                opacity: [0, 1, 0],
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [
                  Math.random() * 0.5 + 0.5,
                  Math.random() * 1 + 1,
                  Math.random() * 0.5 + 0.5
                ]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 bg-violet-500/50 rounded-full blur-[2px]"
              style={{
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}