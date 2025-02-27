
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

export function AuthHeader() {
  return (
    <div className="relative flex flex-col items-center justify-center py-8 space-y-6 overflow-hidden">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        <Logo size="xl" className="transform-none text-[#F2EBE4]" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-center px-4 relative z-10"
      >
        <span className="text-[#F2EBE4] font-tiempos">La Plateforme Intelligente pour</span>
        <br />
        <span className="bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] bg-clip-text text-transparent font-tiempos">
          l'Emploi du Futur
        </span>
      </motion.h1>

      <motion.p 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="text-[#F2EBE4]/80 text-lg text-center max-w-2xl relative z-10"
      >
        Propulsée par l'IA, conçue pour les professionnels d'aujourd'hui
        <br />
        <span className="text-inherit font-thin my-0 mx-0 text-xs py-0">Une entreprise fièrement québécoise</span>
      </motion.p>

      {/* Élément décoratif */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#1A1F2C]/50 to-transparent"></div>
    </div>
  );
}
