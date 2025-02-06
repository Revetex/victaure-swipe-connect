import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserMessage } from "./UserMessage";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConversationMessagesProps {
  messages: Message[];
  showScrollButton?: boolean;
  onScroll?: () => void;
  onScrollToBottom?: () => void;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  isAIChat?: boolean;
}

export function ConversationMessages({
  messages,
  showScrollButton = false,
  onScroll,
  onScrollToBottom,
  onDeleteMessage,
  isAIChat = false
}: ConversationMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex-1">
      <ScrollArea className="h-[calc(100vh-12rem)]" onScroll={onScroll}>
        <div className="flex flex-col gap-2 p-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isAIChat ? (
                  <ChatMessage
                    content={message.content}
                    sender={message.sender_id === "assistant" ? "assistant" : "user"}
                  />
                ) : (
                  <UserMessage
                    message={message}
                    onDelete={
                      onDeleteMessage
                        ? () => onDeleteMessage(message.id)
                        : undefined
                    }
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 right-4"
          >
            <Button
              size="icon"
              variant="secondary"
              onClick={onScrollToBottom}
              className="rounded-full shadow-lg"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}