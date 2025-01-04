import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useMessages } from "@/hooks/useMessages";
import { MessageList } from "../MessageList";
import { ConversationView } from "../conversation/ConversationView";

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
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onMarkAsRead={handleMarkAsRead}
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
    </div>
  );
}