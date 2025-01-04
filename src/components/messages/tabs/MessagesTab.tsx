import { useMessages } from "@/hooks/useMessages";
import { useChat } from "@/hooks/useChat";
import { MessagesList } from "../conversation/MessagesList";
import { ConversationView } from "../conversation/ConversationView";
import { useState } from "react";

export function MessagesTab() {
  const { messages, markAsRead } = useMessages();
  const { messages: chatMessages } = useChat();
  const [selectedConversation, setSelectedConversation] = useState<"assistant" | null>(null);

  const handleMarkAsRead = async (messageId: string) => {
    await markAsRead.mutateAsync(messageId);
  };

  if (selectedConversation === "assistant") {
    return <ConversationView onBack={() => setSelectedConversation(null)} />;
  }

  return (
    <MessagesList
      messages={messages}
      chatMessages={chatMessages}
      onSelectConversation={setSelectedConversation}
      onMarkAsRead={handleMarkAsRead}
    />
  );
}