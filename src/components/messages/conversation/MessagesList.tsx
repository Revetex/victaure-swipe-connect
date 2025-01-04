import { motion } from "framer-motion";
import { MessageSquare, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageItem } from "../MessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/hooks/useMessages";

interface MessagesListProps {
  messages: Message[];
  chatMessages: any[];
  onSelectConversation: (type: "assistant") => void;
  onMarkAsRead: (messageId: string) => void;
}

export function MessagesList({
  messages,
  chatMessages,
  onSelectConversation,
  onMarkAsRead,
}: MessagesListProps) {
  return (
    <motion.div
      key="message-list"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col overflow-hidden"
    >
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {/* M. Victaure - Conversation épinglée */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectConversation("assistant")}
            className="sticky top-0 z-10 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-primary/5 hover:bg-primary/10 border border-primary/20 shadow-sm"
          >
            <div className="flex gap-3">
              <Avatar className="h-12 w-12 shrink-0 ring-2 ring-primary/10">
                <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="Mr. Victaure" />
                <AvatarFallback className="bg-primary/20">
                  <Bot className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium text-primary">M. Victaure</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Assistant IA Personnel
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {chatMessages.length > 0 
                    ? chatMessages[chatMessages.length - 1]?.content 
                    : "Comment puis-je vous aider aujourd'hui ?"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Messages des utilisateurs */}
          {messages.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-primary mb-4">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Messages</h2>
              </div>
              <div className="space-y-2">
                {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    {...message}
                    onMarkAsRead={onMarkAsRead}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}