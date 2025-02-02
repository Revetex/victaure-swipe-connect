import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { AnimatePresence, motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { Profile } from "@/types/profile";
import { Message } from "@/types/messages";

interface ConversationViewProps {
  messages: Message[];
  profile: Profile | null;
  isThinking?: boolean;
  isListening?: boolean;
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string, profile: Profile | null) => void;
  onVoiceInput?: () => void;
  onBack?: () => void;
}

export function ConversationView({
  messages,
  profile,
  isThinking,
  isListening,
  inputMessage,
  onInputChange: setInputMessage,
  onSendMessage,
  onVoiceInput,
  onBack
}: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!isNearBottom);
  };

  const handleSendMessage = async (message: string) => {
    try {
      await onSendMessage(message, profile);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-background">
      <header className="sticky top-0 shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 z-50">
        <div className="flex items-center justify-between">
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
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={profile?.avatar_url || undefined}
                alt={profile?.full_name || "Profile"}
              />
              <AvatarFallback>
                <UserCircle className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">
                {profile?.full_name || "Utilisateur"}
              </span>
              <span className="text-xs text-muted-foreground">
                {profile?.email || ""}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="px-4 py-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isFirst={index === 0}
                isLast={index === messages.length - 1}
              />
            ))}
          </AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 shrink-0 border-t bg-background/95 backdrop-blur-sm p-4">
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
  );
}