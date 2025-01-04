import { useMessages } from "@/hooks/useMessages";
import { useChat } from "@/hooks/useChat";
import { MessagesList } from "../conversation/MessagesList";
import { ConversationView } from "../conversation/ConversationView";
import { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";

export function MessagesTab() {
  const { messages, markAsRead } = useMessages();
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
  const { profile } = useProfile();
  const [selectedConversation, setSelectedConversation] = useState<"assistant" | null>(null);

  const handleMarkAsRead = useCallback(async (messageId: string) => {
    await markAsRead.mutateAsync(messageId);
  }, [markAsRead]);

  if (selectedConversation === "assistant") {
    return (
      <ConversationView 
        messages={chatMessages || []}
        inputMessage={inputMessage}
        isListening={isListening}
        isThinking={isThinking}
        profile={profile}
        onBack={() => setSelectedConversation(null)}
        onSendMessage={handleSendMessage}
        onVoiceInput={handleVoiceInput}
        setInputMessage={setInputMessage}
        onClearChat={clearChat}
      />
    );
  }

  return (
    <MessagesList
      messages={messages}
      chatMessages={chatMessages || []}
      onSelectConversation={setSelectedConversation}
      onMarkAsRead={handleMarkAsRead}
    />
  );
}