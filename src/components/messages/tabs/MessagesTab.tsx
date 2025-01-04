import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useMessages } from "@/hooks/useMessages";
import { MessageList } from "../MessageList";
import { ConversationView } from "../conversation/ConversationView";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

export function MessagesTab() {
  const [selectedConversation, setSelectedConversation] = useState<"assistant" | null>(null);
  const { profile } = useProfile();
  const { messages, isLoading, markAsRead } = useMessages();
  const {
    messages: chatMessages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat,
  } = useChat();

  const handleBackClick = () => {
    setSelectedConversation(null);
  };

  const handleMarkAsRead = async (messageId: string) => {
    await markAsRead.mutateAsync(messageId);
  };

  return (
    <div className="relative h-full overflow-hidden">
      {!selectedConversation ? (
        <div className="flex flex-col h-full">
          <ChatHeader />
          <ScrollArea className="flex-1 p-4">
            <AnimatePresence mode="popLayout">
              {chatMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                  thinking={message.thinking}
                  showTimestamp
                  timestamp={message.timestamp.toISOString()}
                />
              ))}
            </AnimatePresence>
          </ScrollArea>
          <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={() => handleSendMessage(inputMessage, profile)}
              onVoiceInput={handleVoiceInput}
              isListening={isListening}
              isThinking={isThinking}
            />
          </div>
        </div>
      ) : (
        <ConversationView
          messages={chatMessages}
          inputMessage={inputMessage}
          isListening={isListening}
          isThinking={isThinking}
          profile={profile}
          onBack={handleBackClick}
          onSendMessage={handleSendMessage}
          onVoiceInput={handleVoiceInput}
          setInputMessage={setInputMessage}
          onClearChat={clearChat}
        />
      )}
    </div>
  );
}