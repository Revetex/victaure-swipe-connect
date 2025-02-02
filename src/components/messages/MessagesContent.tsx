import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Trash2, ArrowDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

interface MessagesContentProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onBack?: () => void;
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
}

export function MessagesContent({
  messages,
  inputMessage,
  isListening,
  isThinking,
  onBack,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat,
}: MessagesContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = 
      Math.abs((target.scrollHeight - target.scrollTop) - target.clientHeight) < 100;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    if (!showScrollButton) {
      scrollToBottom();
    }
  }, [messages, showScrollButton]);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col pt-safe-top">
      <header className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Avatar className="h-12 w-12 ring-2 ring-primary/10">
              <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="M. Victaure" />
              <AvatarFallback className="bg-primary/20">
                <Bot className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold truncate">M. Victaure</h2>
              <p className="text-sm text-muted-foreground truncate">
                {isThinking ? "En train de réfléchir..." : "Conseiller en Orientation"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearChat}
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-background/80">
        <div 
          ref={scrollAreaRef}
          className="h-[calc(100vh-12rem)] overflow-y-auto px-1 sm:px-2 py-4 scroll-smooth" 
          onScroll={handleScroll}
        >
          <div className="w-full space-y-2">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                  thinking={message.thinking}
                  showTimestamp={true}
                  timestamp={message.timestamp}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        <AnimatePresence>
          {showScrollButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-24 right-4"
            >
              <Button
                size="icon"
                className="rounded-full shadow-lg"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 border-t bg-background/95 backdrop-blur-sm p-4 mb-14">
        <div className="w-full">
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={() => onSendMessage(inputMessage)}
            onVoiceInput={onVoiceInput}
            isListening={isListening}
            isThinking={isThinking}
            placeholder="Posez vos questions à M. Victaure..."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}