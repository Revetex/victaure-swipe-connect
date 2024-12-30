import { useMessages } from "@/hooks/useMessages";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ConversationView } from "../conversation/ConversationView";
import { MessageList } from "../MessageList";

export function MessagesTab() {
  const { messages: userMessages, isLoading, markAsRead } = useMessages();
  const { profile } = useProfile();
  const [selectedConversation, setSelectedConversation] = useState<"assistant" | null>(null);
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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {!selectedConversation ? (
          <MessageList
            messages={userMessages}
            isLoading={isLoading}
            onMarkAsRead={(messageId) => markAsRead.mutate(messageId)}
          />
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
      </AnimatePresence>
    </div>
  );
}