import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Elegant gradient sphere */}
      <motion.div
        animate={{
          opacity: [0.2, 0.3, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_150px,#D6BCFA,transparent)]"
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Subtle grid lines */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            opacity: [0.03, 0.08, 0.03],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(214,188,250,0.05)_50%,transparent_100%)] bg-[length:100%_2px] bg-repeat-y"
          style={{ backgroundPosition: "0 0" }}
        />
      </div>

      {/* Minimal stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0.5,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0.5, 1, 0.5],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-[#E5DEFF]/30 rounded-full blur-[1px] shadow-sm"
            style={{
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          />
        ))}
      </div>

      {/* Elegant pulse rings */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 2 }).map((_, i) => (
          <motion.div
            key={`pulse-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 3],
              opacity: [0.2, 0.1, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#D6BCFA]/10 rounded-full"
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