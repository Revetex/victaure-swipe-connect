import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  content: string;
  role: "assistant" | "user";
}

export function MessageBubble({ content, role }: MessageBubbleProps) {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8 mt-1">
        <div className={cn(
          "h-8 w-8 rounded-full",
          isAssistant ? "bg-primary/10" : "bg-secondary/10"
        )} />
      </Avatar>

      <div
        className={cn(
          "px-4 py-2.5 rounded-2xl max-w-[80%] text-sm",
          isAssistant 
            ? "bg-muted rounded-tl-none" 
            : "bg-primary text-primary-foreground rounded-tr-none"
        )}
      >
        {content}
      </div>
    </motion.div>
  );
}