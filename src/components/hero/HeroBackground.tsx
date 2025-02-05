import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_1000px_at_50%_-100px,#7c3aed,transparent)]"
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Galaxy stars effect */}
      <div className="absolute inset-0 overflow-hidden">
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
      </div>

      {/* Larger stars with glow effect */}
      <div className="absolute inset-0 overflow-hidden">
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
    </>
  );
}