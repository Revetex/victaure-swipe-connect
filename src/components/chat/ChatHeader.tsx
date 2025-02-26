
import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export function ChatHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.div 
            animate={{
              scale: [1, 1.05, 1],
              borderColor: ["rgba(100,181,217,0.2)", "rgba(100,181,217,0.4)", "rgba(100,181,217,0.2)"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-2 rounded-lg bg-[#1A1F2C]/80 border border-[#64B5D9]/20"
          >
            <Bot className="w-5 h-5 text-[#64B5D9]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-[#1A1F2C] animate-pulse" />
          </motion.div>
        </div>
        <div>
          <h3 className="font-medium text-[#F2EBE4]">Mr. Victaure</h3>
          <p className="text-xs text-[#F2EBE4]/60">Assistant IA</p>
        </div>
      </div>
    </motion.div>
  );
}
