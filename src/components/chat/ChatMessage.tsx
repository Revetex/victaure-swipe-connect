import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex gap-3 px-4",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        {isAssistant ? (
          <>
            <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" />
            <AvatarFallback>
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className={cn(
        "flex flex-col gap-2 max-w-[80%] sm:max-w-[70%]",
        isAssistant ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-2 text-sm",
          isAssistant 
            ? "bg-muted text-foreground rounded-tl-none" 
            : "bg-primary text-primary-foreground rounded-tr-none"
        )}>
          {content}
        </div>
        
        {showTimestamp && timestamp && (
          <span className="text-xs text-muted-foreground">
            {format(new Date(timestamp), "HH:mm", { locale: fr })}
          </span>
        )}
      </div>
    </motion.div>
  );
}