import { useState } from "react";
import { ChatMessages } from "./ChatMessages";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat/messageTypes";
import { motion } from "framer-motion";

interface CareerAdvisorChatProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function CareerAdvisorChat({
  messages,
  isLoading,
  onSendMessage,
}: CareerAdvisorChatProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Group messages by conversation
  const conversations = messages.reduce((acc, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <div className="flex h-full gap-4">
      {/* Conversations List */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-64 bg-card rounded-lg shadow-md hidden md:block"
      >
        <div className="p-4 border-b">
          <h2 className="font-semibold">Conversations</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-13rem)]">
          <div className="p-2 space-y-2">
            {Object.entries(conversations).map(([date, msgs]) => (
              <button
                key={date}
                onClick={() => setSelectedConversation(date)}
                className={`w-full p-3 text-left rounded-lg transition-colors ${
                  selectedConversation === date
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <p className="font-medium">{date}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {msgs[msgs.length - 1].content}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-card rounded-lg shadow-md overflow-hidden">
        <ChatHeader isLoading={isLoading} />
        
        <ScrollArea className="flex-1 p-4">
          <ChatMessages 
            messages={selectedConversation ? conversations[selectedConversation] : messages} 
            isTyping={isLoading} 
          />
        </ScrollArea>

        <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
          <QuickSuggestions onSelect={onSendMessage} />
          <ChatInput isLoading={isLoading} onSendMessage={onSendMessage} />
        </div>
      </div>
    </div>
  );
}