import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ChatBubbleProps {
  content: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  timestamp: Date;
  isCurrentUser: boolean;
  action?: string;
}

export function ChatBubble({ content, sender, timestamp, isCurrentUser, action }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2 items-end",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={sender.avatar_url} />
        <AvatarFallback>
          {sender.full_name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "group flex flex-col gap-1 max-w-[80%]",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm",
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted rounded-bl-none",
            action === 'update_complete' && "bg-green-500 text-white"
          )}
        >
          {content}
        </div>
        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          {format(timestamp, "HH:mm", { locale: fr })}
        </span>
      </div>
    </motion.div>
  );
}