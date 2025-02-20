
import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConversationMessagesProps {
  messages: Message[];
  isThinking?: boolean;
  onReply: (content: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ConversationMessages({ 
  messages, 
  isThinking, 
  onReply,
  messagesEndRef 
}: ConversationMessagesProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [fadeDirection, setFadeDirection] = useState<'up' | 'down'>('up');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(false);
  const prevScrollTop = useRef(0);

  const uniqueMessages = useMemo(() => 
    messages.filter((message, index, self) =>
      index === self.findIndex((m) => m.id === message.id)
    ),
    [messages]
  );

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

  const handleScroll = (event: any) => {
    if (isAutoScrollingRef.current) return;

    const target = event.target as HTMLDivElement;
    const currentScrollTop = target.scrollTop;
    setFadeDirection(currentScrollTop > prevScrollTop.current ? 'down' : 'up');
    prevScrollTop.current = currentScrollTop;

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
    <div className="relative flex flex-col h-full bg-background/50">
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 h-full px-4"
        onScrollCapture={handleScroll}
      >
        <div className="space-y-4 py-4 max-w-2xl mx-auto">
          <AnimatePresence mode="popLayout">
            {uniqueMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: fadeDirection === 'up' ? 20 : -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: fadeDirection === 'up' ? -20 : 20 }}
                transition={{ 
                  duration: 0.2,
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              >
                <ChatMessage 
                  message={message} 
                  onReply={onReply}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-4 right-6 z-10"
          >
            <Button
              size="icon"
              variant="secondary"
              onClick={scrollToBottom}
              className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary/10 hover:bg-primary/20"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
