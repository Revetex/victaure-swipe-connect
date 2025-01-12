import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  sender: "assistant" | "user";
  thinking?: boolean;
  showTimestamp?: boolean;
  timestamp?: string | Date;
}

export function ChatMessage({ 
  content, 
  sender,
  thinking = false,
  showTimestamp = false,
  timestamp,
}: ChatMessageProps) {
  const isAssistant = sender === "assistant";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex gap-3 px-3 py-2 sm:px-4",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Avatar className={cn(
            "h-8 w-8 ring-2 transition-shadow duration-200",
            isAssistant 
              ? "ring-primary/10 hover:ring-primary/20" 
              : "ring-blue-500/10 hover:ring-blue-500/20"
          )}>
            {isAssistant ? (
              <>
                <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" />
                <AvatarFallback className="bg-primary/5">
                  <Bot className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </>
            ) : (
              <AvatarFallback className="bg-blue-500/5">
                <User className="h-4 w-4 text-blue-500" />
              </AvatarFallback>
            )}
          </Avatar>
        </motion.div>
      </div>

      <div className={cn(
        "flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%]",
        isAssistant ? "items-start" : "items-end"
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm shadow-sm whitespace-pre-wrap break-words",
            isAssistant 
              ? "bg-card text-card-foreground rounded-tl-none border" 
              : "bg-primary text-primary-foreground rounded-tr-none"
          )}
        >
          {thinking ? (
            <motion.div className="flex items-center gap-2">
              <motion.div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 bg-primary/50 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
              <span className="text-muted-foreground text-sm">M. Victaure réfléchit...</span>
            </motion.div>
          ) : (
            content
          )}
        </motion.div>
        
        {showTimestamp && timestamp && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-muted-foreground px-1"
          >
            {format(new Date(timestamp), "HH:mm", { locale: fr })}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}