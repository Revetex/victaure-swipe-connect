import { useMessages } from "@/hooks/useMessages";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ConversationView } from "../conversation/ConversationView";
import { MessagesList } from "../conversation/MessagesList";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {!selectedConversation ? (
          <MessagesList
            messages={userMessages}
            chatMessages={chatMessages}
            onSelectConversation={setSelectedConversation}
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