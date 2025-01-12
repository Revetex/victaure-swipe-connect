import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatThinking } from "@/components/chat/ChatThinking";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface MessagesContentProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat?: () => void;
  onBack?: () => void;
}

export function MessagesContent({
  messages,
  inputMessage,
  isListening,
  isThinking,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat,
  onBack,
}: MessagesContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!hasScrolled || messages[messages.length - 1]?.sender === "user") {
      scrollToBottom();
    }
  }, [messages, hasScrolled]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    setHasScrolled(!isAtBottom);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="fixed top-0 left-0 right-0 z-50">
        <ChatHeader
          onBack={onBack}
          isThinking={isThinking}
        />
      </div>

      <div className="flex-1 overflow-hidden mt-[72px] mb-[76px]">
        <ScrollArea 
          ref={scrollAreaRef}
          className="h-full"
          onScroll={handleScroll}
        >
          <div className="p-4 space-y-4">
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
              {isThinking && <ChatThinking />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={() => onSendMessage(inputMessage)}
          onVoiceInput={onVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
          className="border-t"
        />
      </div>
    </div>
  );
}