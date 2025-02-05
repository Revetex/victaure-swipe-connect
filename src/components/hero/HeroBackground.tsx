import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroBackground() {
  const [isSafari, setIsSafari] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Detect Safari browser
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <div 
        className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none safari-fix" 
        style={{ 
          WebkitMaskImage: 'radial-gradient(white, transparent 85%)',
          maskImage: 'radial-gradient(white, transparent 85%)'
        }}
      />
      
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: isReducedMotion ? 1 : [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_1000px_at_50%_-100px,#9b87f5,transparent)]"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        />

        {!isReducedMotion && Array.from({ length: isSafari ? 25 : 50 }).map((_, i) => (
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
            className="absolute w-1 h-1 bg-[#9b87f5] rounded-full blur-[1px] safari-fix"
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: isReducedMotion ? 1 : [1, 1.2, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#9b87f530_0deg,transparent_60deg,#9b87f530_120deg,transparent_180deg,#9b87f530_240deg,transparent_300deg)] safari-fix"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        />
      </div>
    </>
  );
}