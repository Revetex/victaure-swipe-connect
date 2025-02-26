
import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export function ChatHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mx-2 my-1"
    >
      <div className="flex items-center gap-2">
        <div className="relative p-2 rounded-xl bg-[#1B2A4A]/80 border border-[#64B5D9]/20">
          <Bot className="w-6 h-6 text-[#64B5D9]" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1A1F2C] animate-pulse" />
        </div>
        <div>
          <h3 className="font-medium text-base text-[#F1F0FB]">Mr. Victaure</h3>
          <p className="text-xs text-[#F1F0FB]/70">Assistant IA</p>
        </div>
      </div>
    </motion.div>
  );
}
