import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface AssistantMessageProps {
  chatMessages: any[];
  onSelectConversation: (type: "assistant") => void;
}

export function AssistantMessage({ chatMessages, onSelectConversation }: AssistantMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelectConversation("assistant")}
      className="group relative p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-card hover:bg-card/80 border shadow-sm hover:shadow-md"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      <div className="relative flex gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-background transition-all duration-200 group-hover:ring-primary/20">
          <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="Mr. Victaure" />
          <AvatarFallback className="bg-primary/5">
            <Bot className="h-6 w-6 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-semibold text-lg">Mr. Victaure</h3>
            <span className="text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded-full">
              Assistant IA
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 text-left">
            {chatMessages.length > 0 
              ? chatMessages[chatMessages.length - 1]?.content 
              : "Comment puis-je vous aider aujourd'hui ?"}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Clock className="h-3 w-3" />
            <span>En ligne</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}