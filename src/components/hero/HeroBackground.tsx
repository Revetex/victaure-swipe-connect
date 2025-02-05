import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <>
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#222222] via-[#1a1a1a] to-[#222222]" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#333333_1px,transparent_1px)] bg-[size:40px_100%] [mask-image:radial-gradient(black,transparent_80%)] opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#333333_1px,transparent_1px)] bg-[size:100%_40px] [mask-image:radial-gradient(black,transparent_80%)] opacity-20" />
      </div>

      {/* Animated gradient sphere */}
      <motion.div
        animate={{
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(132,204,22,0.15) 0%, rgba(21,128,61,0.05) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* AI Neural network effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-lime-400/30 rounded-full"
            style={{
              boxShadow: "0 0 10px rgba(132,204,22,0.5)",
            }}
          />
        ))}
      </div>

      {/* Connecting lines effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`line-${i}`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            className="absolute h-px w-full top-1/3 bg-gradient-to-r from-transparent via-lime-500/20 to-transparent"
            style={{
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: "center",
            }}
          />
        ))}
      </div>
    </>
  );
}