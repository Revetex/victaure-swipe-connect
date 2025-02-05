import { motion } from "framer-motion";

export function HeroStars() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Small stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0.5,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-violet-400/50 rounded-full blur-[2px] shadow-lg shadow-violet-500/20"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        />
      ))}

      {/* Larger stars with glow effect */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`large-${i}`}
          initial={{
            opacity: 0,
            scale: 0.2,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.2, 1.5, 0.2],
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          className="absolute w-2 h-2 bg-violet-300/40 rounded-full blur-[3px] shadow-lg shadow-violet-500/30"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        />
      ))}
    </div>
  );
}