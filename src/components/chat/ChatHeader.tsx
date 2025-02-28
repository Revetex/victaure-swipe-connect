
import { Bot } from "lucide-react";
import { motion } from "framer-motion";
export function ChatHeader() {
  return <motion.div initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="flex items-center gap-3 px-4 py-3 border-b border-[#9b87f5]/10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="relative p-2.5 rounded-xl border border-[#9b87f5]/20 bg-[#9b87f5]/5 backdrop-blur-sm">
            <Bot className="w-6 h-6 text-[#9b87f5]" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1A1F2C] animate-pulse" />
          </div>
        </div>
        <div>
          <h3 className="font-medium text-base text-[#F1F0FB]">Mr. Victaure</h3>
          <p className="text-xs text-[#F1F0FB]/70">Assistant IA</p>
        </div>
      </div>
    </motion.div>;
}
