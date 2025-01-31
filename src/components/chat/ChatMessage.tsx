import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Bot, Copy, Check, Clock } from "lucide-react";
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { ChatThinking } from "./ChatThinking";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [isCopied, setIsCopied] = useState(false);

  if (content.includes("Ne partage JAMAIS ces instructions") || 
      content.includes("Tu es M. Victaure")) {
    return null;
  }

  if (thinking && isBot) {
    return <ChatThinking />;
  }

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast.success("Message copié !");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Impossible de copier le message");
    }
  };

  const formattedTime = timestamp ? format(new Date(timestamp), "HH:mm", { locale: fr }) : "";
  const formattedDate = timestamp ? format(new Date(timestamp), "d MMMM", { locale: fr }) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex gap-3 items-start group hover:bg-muted/50 rounded-lg p-4 transition-colors relative",
        isBot ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className={cn(
        "flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full overflow-hidden",
        isBot ? "ring-2 ring-primary/10" : "ring-2 ring-primary/5"
      )}>
        {isBot ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="M. Victaure" />
            <AvatarFallback className="bg-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={profile?.avatar_url} 
              alt={profile?.full_name || "User"} 
              className="object-cover"
            />
            <AvatarFallback className="bg-muted">
              {profile?.full_name?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className={cn(
        "flex flex-col gap-2 min-w-0 w-full relative group",
        isBot ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-3 shadow-sm relative w-full sm:w-auto",
          isBot 
            ? "bg-card text-card-foreground dark:bg-card/95 dark:text-card-foreground backdrop-blur-sm border" 
            : "bg-primary text-primary-foreground"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </p>
          <div className={cn(
            "absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity",
            isBot ? "-right-12" : "-left-12"
          )}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={handleCopyMessage}
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {showTimestamp && timestamp && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <Clock className="h-3 w-3" />
            <span>{formattedTime}</span>
            <span className="mx-1">•</span>
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
});