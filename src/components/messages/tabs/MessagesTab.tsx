import { MessageSquare } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { MessageList } from "../MessageList";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { supabase } from "@/integrations/supabase/client";

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
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setCurrentUser(profile);
      }
    };
    getCurrentUser();
  }, []);

  // Combine user messages and assistant messages
  const allMessages = [
    ...userMessages,
    ...assistantMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: {
        id: msg.sender === 'assistant' ? 'assistant' : 'user',
        full_name: msg.sender === 'assistant' ? 'Mr Victaure' : 'Vous',
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

    // Get all messages for this conversation
    const conversationMessages = allMessages.filter(m => 
      (m.sender.id === conversation.sender.id && m.sender.id !== 'assistant') ||
      (m.sender.id === currentUser?.id) ||
      (conversation.sender.id === 'assistant' && m.sender.id === 'assistant')
    );

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 border-b">
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

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {conversationMessages.map((message) => (
              <ChatBubble
                key={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={new Date(message.created_at)}
                isCurrentUser={message.sender.id === currentUser?.id}
              />
            ))}
            {isThinking && (
              <ChatBubble
                content="En train d'écrire..."
                sender={{
                  id: 'assistant',
                  full_name: 'Mr Victaure',
                  avatar_url: '/bot-avatar.png'
                }}
                timestamp={new Date()}
                isCurrentUser={false}
              />
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-background p-4 border-t">
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