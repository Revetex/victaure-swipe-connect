import { ConversationView } from "./conversation/ConversationView";
import { MessagesList } from "./conversation/MessagesList";
import { useProfile } from "@/hooks/useProfile";
import { useMessages } from "@/hooks/useMessages";
import { useState } from "react";

interface MessagesContentProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string, profile: any) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
}

export function MessagesContent({
  messages: chatMessages,
  inputMessage,
  isListening,
  isThinking,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat
}: MessagesContentProps) {
  const { profile } = useProfile();
  const { messages, markAsRead } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<"list" | "assistant">("list");

  const handleBack = () => {
    setSelectedConversation("list");
  };

  const handleSelectConversation = (type: "assistant") => {
    setSelectedConversation(type);
  };

  if (selectedConversation === "assistant") {
    return (
      <div className="h-full">
        <ConversationView
          messages={chatMessages}
          inputMessage={inputMessage}
          isListening={isListening}
          isThinking={isThinking}
          profile={profile}
          onBack={handleBack}
          onSendMessage={onSendMessage}
          onVoiceInput={onVoiceInput}
          setInputMessage={setInputMessage}
          onClearChat={onClearChat}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <MessagesList
        messages={messages}
        chatMessages={chatMessages}
        onSelectConversation={handleSelectConversation}
        onMarkAsRead={(messageId) => markAsRead.mutate(messageId)}
      />
    </div>
  );
}