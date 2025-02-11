
import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserMessage } from "./UserMessage";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
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
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const prevMessagesLength = useRef(messages.length);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  useEffect(() => {
    if (messages.length !== prevMessagesLength.current) {
      if (shouldAutoScroll) {
        scrollToBottom();
      }
      prevMessagesLength.current = messages.length;
    }
  }, [messages, shouldAutoScroll]);

  useEffect(() => {
    // Initial scroll to bottom
    scrollToBottom('auto');
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isAtBottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 100;
    setShouldAutoScroll(isAtBottom);
    
    if (onScroll) {
      onScroll();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
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
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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
            ))}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center p-4"
              >
                <div className="animate-pulse text-muted-foreground">
                  En train de réfléchir...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <AnimatePresence>
        {!shouldAutoScroll && showScrollButton && (
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
                setShouldAutoScroll(true);
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
