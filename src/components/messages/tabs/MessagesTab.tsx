import { MessageSquare } from "lucide-react";
import { MessageList } from "../MessageList";
import { useMessages } from "@/hooks/useMessages";
import { useChat } from "@/hooks/useChat";

export function MessagesTab() {
  const { messages: userMessages, isLoading, markAsRead } = useMessages();
  const {
    messages: assistantMessages,
    inputMessage,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    isListening,
  } = useChat();

  // Combine user messages and assistant messages
  const allMessages = [
    ...userMessages,
    ...assistantMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: {
        id: 'assistant',
        full_name: 'Assistant IA',
        avatar_url: '/bot-avatar.png'
      },
      created_at: msg.timestamp.toISOString(),
      read: true
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary mb-4">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      <MessageList
        messages={allMessages}
        isLoading={isLoading}
        onMarkAsRead={markAsRead.mutate}
      />
    </div>
  );
}