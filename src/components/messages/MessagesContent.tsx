import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import { Message } from "@/types/chat/messageTypes";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { AssistantMessage } from "./conversation/AssistantMessage";
import { UserMessage } from "./conversation/UserMessage";

interface MessagesContentProps {
  messages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
  onBack: () => void;
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background/80">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col">
              <h2 className="text-sm font-medium">M. Victaure</h2>
              <p className="text-xs text-muted-foreground">Assistant IA</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearChat}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <ScrollArea 
        ref={scrollRef}
        className="flex-1 px-4 py-4 mt-16 pb-32 overflow-y-auto"
      >
        <div className="space-y-4 max-w-3xl mx-auto">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                ref={index === messages.length - 1 ? lastMessageRef : null}
              >
                {message.sender === "assistant" ? (
                  <AssistantMessage message={message} />
                ) : (
                  <UserMessage message={message} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="fixed bottom-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-t z-50">
        <div className="max-w-5xl mx-auto">
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={() => onSendMessage(inputMessage)}
            onVoiceInput={onVoiceInput}
            isListening={isListening}
            isThinking={isThinking}
            placeholder="Écrivez votre message..."
          />
        </div>
      </div>
    </div>
  );
}