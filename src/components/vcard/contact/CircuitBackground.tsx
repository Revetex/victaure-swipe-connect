import { motion } from "framer-motion";

export function CircuitBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        className="absolute inset-0"
      >
        {/* Horizontal Lines */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`h-line-${i}`}
            className="absolute h-px bg-gradient-to-r from-purple-500/20 via-purple-500/40 to-purple-500/20"
            style={{ top: `${i * 10}%`, left: 0, right: 0 }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: 1, 
              opacity: 1,
              transition: { 
                delay: i * 0.1,
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
        
        {/* Circuit Nodes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute w-2 h-2 rounded-full bg-purple-500/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2
              }
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}