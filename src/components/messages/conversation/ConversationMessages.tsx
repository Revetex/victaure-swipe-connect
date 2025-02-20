
import { Message } from "@/types/messages";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationMessagesProps {
  messages: Message[];
  isThinking?: boolean;
  onReply: (content: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export function ConversationMessages({
  messages,
  isThinking,
  onReply,
  messagesEndRef,
  className
}: ConversationMessagesProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(false);

  const uniqueMessages = useMemo(() => messages.filter((message, index, self) => 
    index === self.findIndex(m => m.id === message.id)
  ), [messages]);

  // Grouper les messages par date
  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: Message[] } = {};
    uniqueMessages.forEach(message => {
      const date = new Date(message.created_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  }, [uniqueMessages]);

  useEffect(() => {
    const scrollToBottom = (smooth = true) => {
      if (messagesEndRef.current) {
        isAutoScrollingRef.current = true;
        messagesEndRef.current.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "end"
        });
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 100);
      }
    };
    
    if (uniqueMessages.length > 0) {
      scrollToBottom();
    }
  }, [uniqueMessages.length]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isAutoScrollingRef.current) return;
    const target = event.currentTarget;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea 
        className={cn("flex-1 px-4", className)}
        onScroll={handleScroll}
        ref={containerRef}
      >
        <div className="max-w-3xl mx-auto py-4">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-muted/50 px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {date}
                </div>
              </div>
              <div className="space-y-2">
                {dateMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChatMessage 
                      message={message}
                      onReply={onReply}
                      showAvatar={
                        index === 0 || 
                        dateMessages[index - 1]?.sender_id !== message.sender_id ||
                        Date.parse(message.created_at) - Date.parse(dateMessages[index - 1]?.created_at) > 300000
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Button
              size="icon"
              variant="secondary"
              onClick={scrollToBottom}
              className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
