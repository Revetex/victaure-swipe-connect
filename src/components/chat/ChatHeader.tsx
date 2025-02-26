
import { Bot, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ChatHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2.5"
    >
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <motion.div 
            animate={{
              scale: [1, 1.03, 1],
              borderColor: ["rgba(100,181,217,0.1)", "rgba(100,181,217,0.2)", "rgba(100,181,217,0.1)"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-2 rounded-lg bg-[#1A1F2C]/90 border border-[#64B5D9]/10 relative"
          >
            <img 
              src="/lovable-uploads/black-white-logo.png"
              alt="Victaure Logo"
              className="w-5 h-5 object-contain opacity-90"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400/80 rounded-full border border-[#1A1F2C]"
            />
          </motion.div>
        </div>
        <div>
          <h3 className="font-medium text-[#F2EBE4] text-sm">Mr. Victaure</h3>
          <p className="text-[10px] text-[#F2EBE4]/50 font-light">Assistant IA</p>
        </div>
      </div>
    </motion.div>
  );
}
