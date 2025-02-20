
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface AssistantMessageProps {
  chatMessages: any[];
  onSelectConversation: (type: "assistant") => void;
}

export function AssistantMessage({
  chatMessages,
  onSelectConversation
}: AssistantMessageProps) {
  const lastMessage = chatMessages[chatMessages.length - 1];
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
      onClick={() => onSelectConversation("assistant")}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" />
        <AvatarFallback>
          <Bot className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0 text-left">
        <p className="font-medium">M. Victaure</p>
        <p className="text-sm text-muted-foreground truncate">
          {lastMessage?.content || "Commencer une nouvelle conversation"}
        </p>
      </div>
    </motion.button>
  );
}
