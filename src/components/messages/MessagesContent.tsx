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

  const fixedMessages = messages.slice(0, 2); // First two messages are fixed
  const scrollableMessages = messages.slice(2); // Rest are scrollable

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader
        onBack={onBack}
        isThinking={isThinking}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed messages section */}
        <div className="flex-shrink-0 border-b">
          <AnimatePresence mode="popLayout">
            {fixedMessages.map((message) => (
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
        </div>

        {/* Scrollable messages section */}
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1"
          onScroll={handleScroll}
        >
          <div className="p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {scrollableMessages.map((message) => (
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
  );
}