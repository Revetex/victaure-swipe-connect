import { motion } from "framer-motion";
import { Bot, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MessagesListProps {
  messages: any[];
  chatMessages: any[];
  onSelectConversation: (type: "assistant") => void;
  onMarkAsRead: (messageId: string) => void;
}

export function MessagesList({
  messages,
  chatMessages,
  onSelectConversation,
  onMarkAsRead
}: MessagesListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <div className="space-y-2 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => onSelectConversation("assistant")}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="M. Victaure" />
            <AvatarFallback>
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium truncate">M. Victaure</p>
              {chatMessages.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {format(new Date(chatMessages[chatMessages.length - 1].timestamp), "HH:mm", { locale: fr })}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              Assistant IA Personnel
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}