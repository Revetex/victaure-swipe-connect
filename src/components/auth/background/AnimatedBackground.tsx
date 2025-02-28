
import { motion } from "framer-motion";
import { CircuitBackground } from "@/components/vcard/contact/CircuitBackground";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <CircuitBackground />
      
      {/* Étoiles scintillantes */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          initial={{ opacity: 0.1 }}
          animate={{ 
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      {/* Halos lumineux animés */}
      <motion.div
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1],
          rotate: 360
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#64B5D9]/10 rounded-full blur-[100px]"
      />
      
      <motion.div
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1],
          rotate: -360
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-[#D3E4FD]/10 rounded-full blur-[120px]"
      />

      {/* Grille avec effet de profondeur */}
      <div 
        className="absolute inset-0 bg-grid-white/[0.02]" 
        style={{ 
          backgroundSize: '50px 50px',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)'
        }}
      />

      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
    </div>
  );
}
