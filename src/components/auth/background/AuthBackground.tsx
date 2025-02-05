import { motion } from "framer-motion";

export function AuthBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <div className="absolute inset-0 overflow-hidden">
          {/* Small stars */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`star-sm-${i}`}
              className="absolute h-1 w-1 rounded-full bg-primary/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Medium stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`star-md-${i}`}
              className="absolute h-2 w-2 rounded-full bg-primary/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Large stars with enhanced glow effect */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`star-lg-${i}`}
              className="absolute h-3 w-3 rounded-full bg-primary/20 shadow-lg shadow-primary/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1.8, 0],
                opacity: [0, 0.7, 0],
                boxShadow: [
                  "0 0 0 0 rgba(var(--primary), 0)",
                  "0 0 30px 4px rgba(var(--primary), 0.4)",
                  "0 0 0 0 rgba(var(--primary), 0)",
                ],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Connecting lines */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px bg-primary/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 50}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}