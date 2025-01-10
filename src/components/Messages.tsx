import { useChat } from "@/hooks/useChat";
import { MessagesContent } from "./messages/MessagesContent";
import { useState } from "react";
import { MessagesList } from "./messages/conversation/MessagesList";
import { useMessages } from "@/hooks/useMessages";

export function Messages() {
  const {
    messages: chatMessages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat
  } = useChat();

  const { messages, markAsRead } = useMessages();
  const [showConversation, setShowConversation] = useState(false);

  const handleBack = () => {
    setShowConversation(false);
  };

  const handleSelectConversation = (type: "assistant") => {
    setShowConversation(true);
  };

  // Create a wrapper function that calls the mutation
  const handleMarkAsRead = (messageId: string) => {
    markAsRead.mutate(messageId);
  };

  return (
    <div className="h-full flex flex-col">
      {showConversation ? (
        <MessagesContent
          messages={chatMessages}
          inputMessage={inputMessage}
          isListening={isListening}
          isThinking={isThinking}
          onSendMessage={handleSendMessage}
          onVoiceInput={handleVoiceInput}
          setInputMessage={setInputMessage}
          onClearChat={clearChat}
          onBack={handleBack}
        />
      ) : (
        <MessagesList
          messages={messages}
          chatMessages={chatMessages}
          onSelectConversation={handleSelectConversation}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
}