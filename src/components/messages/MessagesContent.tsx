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
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
  onBack?: () => void;
  showingChat?: boolean;
}

export function MessagesContent({
  messages = [],
  inputMessage = "",
  isListening = false,
  isThinking = false,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat = () => {},
  onBack,
  showingChat,
}: MessagesContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleSendMessage = () => {
    if (onSendMessage && inputMessage.trim()) {
      onSendMessage(inputMessage);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    if (!showScrollButton) {
      scrollToBottom();
    }
  }, [messages, showScrollButton]);

  const handleClearChat = async () => {
    try {
      await onClearChat();
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0f172a] text-white">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0f172a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f172a]/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="shrink-0 text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="M. Victaure" />
              <AvatarFallback className="bg-primary/20">
                <Bot className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold truncate text-white">M. Victaure</h2>
              <p className="text-sm text-gray-400 truncate">
                {isThinking ? "En train de réfléchir..." : "Assistant en orientation professionnelle"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="shrink-0 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ScrollArea 
          className="h-full px-4 pb-36 pt-4" 
          onScroll={handleScroll}
        >
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id || index}
                  content={message.content}
                  sender={message.sender}
                  thinking={message.thinking}
                  showTimestamp={
                    index === 0 || 
                    messages[index - 1]?.sender !== message.sender ||
                    new Date(message.timestamp).getTime() - new Date(messages[index - 1]?.timestamp).getTime() > 300000
                  }
                  timestamp={message.timestamp}
                />
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
              className="fixed bottom-32 right-4 z-50"
            >
              <Button
                size="icon"
                className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f172a]/60 border-t border-gray-800 pb-safe">
        <div className="px-4 py-2">
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            onVoiceInput={onVoiceInput}
            isListening={isListening}
            isThinking={isThinking}
            placeholder="Écrivez votre message à M. Victaure..."
          />
        </div>
      </div>
    </div>
  );
}