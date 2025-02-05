import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Futuristic gradient orb */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_1000px_at_50%_200px,#7c3aed,transparent)]"
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Futuristic grid lines */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(124,58,237,0.1)_50%,transparent_100%)] bg-[length:100%_4px] bg-repeat-y"
          style={{ backgroundPosition: "0 0" }}
        />
      </div>

      {/* Enhanced galaxy stars effect */}
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
              scale: [0.5, 1.2, 0.5],
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
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          />
        ))}
      </div>

      {/* Futuristic pulse rings */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`pulse-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 2, 4],
              opacity: [0.5, 0.25, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.3,
              ease: "easeOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-violet-500/20 rounded-full"
            style={{
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          />
        ))}
      </div>
    </>
  );
}