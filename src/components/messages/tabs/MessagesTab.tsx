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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "@/components/chat/ChatHeader";

export function MessagesTab() {
  const { messages: userMessages, isLoading, markAsRead } = useMessages();
  const {
    messages: assistantMessages,
    inputMessage,
    isThinking,
    setInputMessage,
    sendMessage,
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

  const allMessages = [
    ...userMessages,
    ...assistantMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: {
        id: msg.sender.id,
        full_name: msg.sender.full_name,
        avatar_url: msg.sender.avatar_url
      },
      created_at: msg.timestamp.toISOString(),
      read: true
    }))
  ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        onClearChat={() => setSelectedConversation(null)} 
        isThinking={isThinking}
      />

      {selectedConversation ? (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {allMessages.map((message) => (
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
          </ScrollArea>

          <div className="p-4 border-t bg-background">
            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={sendMessage}
              onVoiceInput={handleVoiceInput}
              isListening={isListening}
              isThinking={isThinking}
            />
          </div>
        </>
      ) : (
        <MessageList
          messages={allMessages}
          isLoading={isLoading}
          onMarkAsRead={markAsRead.mutate}
          onSelectConversation={setSelectedConversation}
        />
      )}
    </div>
  );
}