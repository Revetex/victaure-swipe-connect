import { MessageSquare } from "lucide-react";
import { MessageList } from "../MessageList";
import { useMessages } from "@/hooks/useMessages";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

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

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Combine user messages and assistant messages
  const allMessages = [
    ...userMessages,
    ...assistantMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: {
        id: msg.sender === 'assistant' ? 'assistant' : 'user',
        full_name: msg.sender === 'assistant' ? 'Assistant IA' : 'Vous',
        avatar_url: msg.sender === 'assistant' ? '/bot-avatar.png' : undefined
      },
      created_at: msg.timestamp.toISOString(),
      read: true
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedConversation) {
    const conversation = allMessages.find(m => m.id === selectedConversation);
    if (!conversation) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedConversation(null)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {conversation.sender.full_name}
            </h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-4">
            {/* Afficher les messages de la conversation ici */}
            <p>{conversation.content}</p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background pt-2">
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            onVoiceInput={handleVoiceInput}
            isListening={isListening}
            isThinking={isThinking}
          />
        </div>
      </div>
    );
  }

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
        onSelectConversation={setSelectedConversation}
      />
    </div>
  );
}