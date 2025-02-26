
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
}

export function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-[#F1F0FB]/10">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-8 h-8 rounded-full bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] flex items-center justify-center"
        >
          <MessageCircle className="w-4 h-4 text-white" />
        </motion.div>
        <div>
          <h3 className="font-medium text-[#F1F0FB]">{title}</h3>
          {subtitle && (
            <p className="text-sm text-[#F1F0FB]/60">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
