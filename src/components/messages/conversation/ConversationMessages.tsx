
import { Message } from "@/types/messages";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

  // Dédupliquer les messages en utilisant useMemo
  const uniqueMessages = useMemo(() => 
    messages.filter((message, index, self) =>
      index === self.findIndex((m) => m.id === message.id)
    ),
    [messages]
  );

  // Gérer le scroll automatique quand de nouveaux messages arrivent
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
    const isNearBottom = 
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("flex flex-col h-full relative", className)}
      onScroll={handleScroll}
    >
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto py-4 space-y-4">
          {uniqueMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChatMessage 
                message={message} 
                onReply={onReply}
              />
            </motion.div>
          ))}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

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
