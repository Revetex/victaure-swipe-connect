import { motion } from "framer-motion";
import { MessageSquare, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {/* Assistant Message Item */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectConversation("assistant")}
            className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-card hover:bg-card/80 border shadow-sm"
          >
            <div className="flex gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="Mr. Victaure" />
                <AvatarFallback className="bg-primary/20">
                  <Bot className="h-6 w-6 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-lg">Mr. Victaure</h3>
                  <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                    Assistant IA
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {chatMessages.length > 0 
                    ? chatMessages[chatMessages.length - 1]?.content 
                    : "Comment puis-je vous aider ?"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Messages Section */}
          {messages.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 text-primary mb-4">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Messages récents</h2>
              </div>
              <div className="space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-card hover:bg-card/80 transition-colors border shadow-sm"
                    onClick={() => onMarkAsRead(message.id)}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{message.sender.full_name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}