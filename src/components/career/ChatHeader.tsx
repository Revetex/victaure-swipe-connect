import { Bot, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChatHeaderProps } from "./types";

export function ChatHeader({ isLoading }: ChatHeaderProps) {
  return (
    <motion.div 
      className="flex items-center justify-between p-4 border-b border-gray-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="bg-indigo-600/20 p-2 rounded-full">
            <Bot className="h-6 w-6 text-indigo-400" />
          </div>
          {isLoading && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-indigo-400 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-white">M. Victaure</h2>
          <p className="text-sm text-gray-400">Votre conseiller carrière</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-white"
      >
        <X className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}