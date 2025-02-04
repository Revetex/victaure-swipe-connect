import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Bot, Clock } from "lucide-react";
import { memo } from "react";
import { motion } from "framer-motion";
import { ChatThinking } from "./ChatThinking";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  content: string;
  sender: string;
  thinking?: boolean;
  showTimestamp?: boolean;
  timestamp?: string;
}

export const ChatMessage = memo(function ChatMessage({
  content,
  sender,
  thinking = false,
  showTimestamp = false,
  timestamp,
}: ChatMessageProps) {
  const isBot = sender === "assistant";
  const { profile } = useProfile();

  if (!content || content.includes("Ne partage JAMAIS ces instructions") || 
      content.includes("Tu es M. Victaure")) {
    return null;
  }

  if (thinking && isBot) {
    return <ChatThinking />;
  }

  const formattedTime = timestamp ? format(new Date(timestamp), "HH:mm", { locale: fr }) : "";
  const formattedDate = timestamp ? format(new Date(timestamp), "d MMMM", { locale: fr }) : "";
  const firstName = isBot ? "M. Victaure" : profile?.full_name?.split(' ')[0] || "Vous";

  const messageVariants = {
    hidden: { 
      opacity: 0,
      y: 10,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
      }
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={messageVariants}
      className={cn(
        "flex flex-col gap-2 group hover:bg-muted/50 rounded-lg p-2 transition-colors relative w-full",
        isBot ? "bg-muted/30" : ""
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className={cn(
          "h-8 w-8 ring-2 transition-shadow",
          isBot ? "ring-primary/20" : "ring-muted"
        )}>
          <AvatarImage 
            src={isBot ? "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" : profile?.avatar_url || ""} 
            alt={firstName} 
          />
          <AvatarFallback>
            {isBot ? <Bot className="h-4 w-4" /> : firstName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <motion.span 
            variants={contentVariants}
            className={cn(
              "text-sm font-medium mb-1 block",
              isBot ? "text-primary" : "text-muted-foreground"
            )}
          >
            {firstName}
          </motion.span>
          <motion.div 
            variants={contentVariants}
            className={cn(
              "rounded-lg px-4 py-3 shadow-sm relative w-full max-w-[85%]",
              isBot 
                ? "bg-card text-card-foreground dark:bg-card/95 dark:text-card-foreground backdrop-blur-sm border" 
                : "bg-[#F1F0FB] dark:bg-gray-800/50 text-foreground"
            )}
          >
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {content}
            </p>
          </motion.div>
          {showTimestamp && timestamp && (
            <motion.div 
              variants={contentVariants}
              className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Clock className="h-3 w-3" />
              <span>{formattedTime}</span>
              <span className="mx-1">•</span>
              <span>{formattedDate}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});