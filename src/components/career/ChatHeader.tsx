import { Bot, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ChatHeaderProps } from "./types";

export function ChatHeader({ isLoading }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.div
            animate={isLoading ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center ring-2 ring-indigo-600/40">
              <Bot className="h-5 w-5 text-indigo-400" />
            </div>
          </motion.div>
          {isLoading && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-gray-900" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            M. Victaure
            <Sparkles className="h-4 w-4 text-yellow-400" />
          </h2>
          <p className="text-sm text-gray-400">
            {isLoading ? "En train de réfléchir..." : "Conseiller en Orientation"}
          </p>
        </div>
      </div>
    </div>
  );
}