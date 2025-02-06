import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";

interface ChatMessageProps {
  content: string;
  sender: "user" | "assistant";
  avatar_url?: string;
}

export function ChatMessage({ content, sender, avatar_url }: ChatMessageProps) {
  const { profile } = useProfile();
  const isAssistant = sender === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 p-4",
        isAssistant ? "bg-muted/50" : "bg-background"
      )}
    >
      <Avatar className={cn(
        "h-10 w-10 ring-2 transition-shadow hover:ring-4",
        isAssistant ? "ring-primary/20" : "ring-muted"
      )}>
        {isAssistant ? (
          <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary" />
          </div>
        ) : (
          <img
            src={profile?.avatar_url || "/user-icon.svg"}
            alt="Your avatar"
            className="h-full w-full object-cover rounded-full"
          />
        )}
      </Avatar>
      <div className="flex-1 space-y-2">
        <p className={cn(
          "text-sm font-medium",
          isAssistant ? "text-primary" : "text-foreground"
        )}>
          {isAssistant ? "M. Victaure" : "Vous"}
        </p>
        <Card className={cn(
          "p-4 shadow-sm transition-all duration-200",
          isAssistant 
            ? "bg-card hover:shadow-md border-primary/10" 
            : "bg-primary text-primary-foreground border-0 hover:bg-primary/90"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </Card>
      </div>
    </motion.div>
  );
}