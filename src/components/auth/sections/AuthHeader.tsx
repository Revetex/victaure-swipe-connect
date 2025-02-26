
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

export function AuthHeader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Logo size="xl" className="transform-none text-[#E0E0E0]" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#E0E0E0] font-tiempos text-center px-4"
      >
        La Plateforme Intelligente pour
        <br />
        <span className="text-[#64B5D9]">l'Emploi du Futur</span>
      </motion.h1>

      <motion.p 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="text-[#808080] text-lg text-center max-w-2xl"
      >
        Propulsée par l'IA, conçue pour les professionnels d'aujourd'hui
        <br />
        <span className="text-[#64B5D9] font-medium">Une entreprise fièrement québécoise</span>
      </motion.p>
    </div>
  );
}
