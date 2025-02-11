
import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserMessage } from "./UserMessage";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationMessagesProps {
  messages: Message[];
  showScrollButton?: boolean;
  onScroll?: () => void;
  onScrollToBottom?: () => void;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  isAIChat?: boolean;
  isThinking?: boolean;
  isLoading?: boolean;
}

export function ConversationMessages({
  messages,
  showScrollButton = false,
  onScroll,
  onScrollToBottom,
  onDeleteMessage,
  isAIChat = false,
  isThinking = false,
  isLoading = false
}: ConversationMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const prevMessagesLength = useRef(messages.length);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    setShouldAutoScroll(true);
    setIsNearBottom(true);
  };

  useEffect(() => {
    if (messages.length !== prevMessagesLength.current) {
      if (shouldAutoScroll || messages.length === 0) {
        scrollToBottom();
      }
      prevMessagesLength.current = messages.length;
    }
  }, [messages, shouldAutoScroll]);

  useEffect(() => {
    // Scroll initial
    scrollToBottom('auto');
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isAtBottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 100;
    setIsNearBottom(isAtBottom);
    setShouldAutoScroll(isAtBottom);
    
    if (onScroll) {
      onScroll();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 animate-in fade-in-0 duration-500">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex-1">
      <ScrollArea 
        className="h-[calc(100vh-12rem)]" 
        onScrollCapture={handleScroll}
      >
        <div className="flex flex-col gap-2 p-4">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center h-32 text-muted-foreground"
              >
                Aucun message
              </motion.div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1
                  }}
                  className="will-change-transform"
                >
                  {isAIChat ? (
                    <ChatMessage
                      content={message.content}
                      sender={message.sender_id === "assistant" ? "assistant" : "user"}
                      timestamp={message.created_at}
                      status={message.status}
                    />
                  ) : (
                    <UserMessage
                      message={message}
                      onDelete={onDeleteMessage ? () => onDeleteMessage(message.id) : undefined}
                    />
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
          
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center p-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">En train de réfléchir...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-px" />
        </div>
      </ScrollArea>

      <AnimatePresence>
        {!isNearBottom && showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 right-4"
          >
            <Button
              size="icon"
              variant="secondary"
              onClick={() => {
                scrollToBottom();
                if (onScrollToBottom) onScrollToBottom();
              }}
              className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
