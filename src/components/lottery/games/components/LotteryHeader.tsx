
import { motion } from "framer-motion";

export function LotteryHeader() {
  return (
    <div className="mb-6">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white"
      >
        Lotosphère
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-white/70"
      >
        Jeu de tirage au sort avec cagnotte progressive
      </motion.p>
      
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="h-px w-full bg-gradient-to-r from-transparent via-[#64B5D9]/30 to-transparent mt-4 mb-6"
      />
    </div>
  );
}
