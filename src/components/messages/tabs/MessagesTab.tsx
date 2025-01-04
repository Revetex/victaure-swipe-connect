import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useMessages } from "@/hooks/useMessages";
import { MessagesList } from "../conversation/MessagesList";
import { ConversationView } from "../conversation/ConversationView";

export function MessagesTab() {
  const [selectedConversation, setSelectedConversation] = useState<"assistant" | null>(null);
  const { profile } = useProfile();
  const { messages, markMessageAsRead } = useMessages();
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
    await markMessageAsRead(messageId);
  };

  return (
    <div className="relative h-full overflow-hidden">
      {!selectedConversation ? (
        <MessagesList
          messages={messages}
          chatMessages={chatMessages}
          onSelectConversation={setSelectedConversation}
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