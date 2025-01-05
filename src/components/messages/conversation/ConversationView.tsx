import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Trash2, ArrowDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

interface ConversationViewProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  profile: any;
  onBack?: () => void;
  onSendMessage: (message: string, profile: any) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
}

export function ConversationView({
  messages,
  inputMessage,
  isListening,
  isThinking,
  profile,
  onBack,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat,
}: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

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

  const handleSendMessage = async (message: string) => {
    try {
      await onSendMessage(message, profile);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col pt-16">
      <header className="shrink-0 border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="shrink-0 hover:bg-accent/10 transition-colors h-12 w-12"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="Mr. Victaure" />
              <AvatarFallback className="bg-accent/20">
                <Bot className="h-7 w-7 text-accent" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold truncate text-foreground">
                Mr. Victaure
              </h2>
              <p className="text-base text-muted-foreground truncate">
                {isThinking ? "En train de réfléchir..." : "Assistant IA Personnel"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors h-12 w-12"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-background">
        <ScrollArea 
          className="h-full px-4 py-6" 
          onScroll={handleScroll}
        >
          <div className="max-w-6xl mx-auto space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatMessage
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
              className="fixed bottom-28 right-6"
            >
              <Button
                size="icon"
                className="rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-colors h-12 w-12"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 border-t bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={() => handleSendMessage(inputMessage)}
            onVoiceInput={onVoiceInput}
            isListening={isListening}
            isThinking={isThinking}
            placeholder="Écrivez votre message..."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}