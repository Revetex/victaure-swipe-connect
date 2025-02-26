
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/messages";
import { ChatMessage } from "../../ChatMessage";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { RefObject, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  onDeleteMessage: (messageId: string) => void;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  onDeleteMessage,
  messagesEndRef 
}: MessageListProps) {
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, messagesEndRef]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <ChatMessage 
                message={message}
                isOwn={message.sender_id === currentUserId}
              />
              {message.sender_id === currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDeleteMessage(message.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
