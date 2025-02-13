
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Bot, Check, CheckCheck } from "lucide-react";

interface ChatMessageProps {
  content: string;
  sender: "user" | "assistant";
  timestamp?: string;
  isRead?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  reaction?: string;
}

export function ChatMessage({ 
  content, 
  sender, 
  timestamp,
  isRead,
  status,
  reaction 
}: ChatMessageProps) {
  const isUser = sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col",
        isUser && "items-end"
      )}>
        <Card className={cn(
          "px-3 py-2 max-w-md",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {content}
        </Card>
        
        <div className="flex items-center gap-1 px-2 mt-1">
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(timestamp), "HH:mm", { locale: fr })}
            </span>
          )}
          {isUser && status && (
            <span className="text-xs text-muted-foreground">
              {status === 'sent' && <Check className="h-3 w-3" />}
              {status === 'delivered' && <CheckCheck className="h-3 w-3" />}
              {status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
            </span>
          )}
        </div>
        
        {reaction && (
          <div className="text-sm text-muted-foreground mt-1">
            {reaction}
          </div>
        )}
      </div>
    </motion.div>
  );
}
