import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  // Check if the content contains a code block
  const hasCodeBlock = content.includes("```");
  
  // Function to format content with code blocks
  const formatContent = () => {
    if (!hasCodeBlock) return content;

    const parts = content.split("```");
    return parts.map((part, index) => {
      if (index % 2 === 1) { // This is a code block
        return (
          <ScrollArea key={index} className="w-full max-h-[300px] my-2">
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code className="text-sm font-mono">{part.trim()}</code>
            </pre>
          </ScrollArea>
        );
      }
      // This is regular text
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2 items-end mb-4",
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
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted rounded-bl-none",
            action === 'update_complete' && "bg-green-500 text-white",
            hasCodeBlock && "max-w-full w-full"
          )}
        >
          {formatContent()}
        </motion.div>
        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          {format(timestamp, "HH:mm", { locale: fr })}
        </span>
      </div>
    </motion.div>
  );
}