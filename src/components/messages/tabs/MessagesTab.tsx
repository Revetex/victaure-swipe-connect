import { MessageSquare } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "@/components/chat/ChatInput";
import { useState, useEffect } from "react";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

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
    clearChat
  } = useChat();

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
        id: msg.sender === 'assistant' ? 'assistant' : currentUser?.id,
        full_name: msg.sender === 'assistant' ? 'Mr Victaure' : currentUser?.full_name || 'Vous',
        avatar_url: msg.sender === 'assistant' ? '/bot-avatar.png' : currentUser?.avatar_url
      },
      created_at: msg.timestamp.toISOString(),
      read: true
    }))
  ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Grouper les messages par date
  const messagesByDate = allMessages.reduce((groups, message) => {
    const date = new Date(message.created_at);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(message);
    return groups;
  }, {} as Record<string, typeof allMessages>);

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return "Hier";
    }
    return format(date, 'd MMMM yyyy', { locale: fr });
  };

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
        isThinking={isThinking} 
        onClearChat={clearChat}
      />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-8">
          {Object.entries(messagesByDate).map(([dateStr, messages]) => (
            <div key={dateStr} className="space-y-4">
              <div className="sticky top-0 z-10 flex justify-center">
                <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                  {formatDateHeader(dateStr)}
                </span>
              </div>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                  timestamp={new Date(message.created_at)}
                  isCurrentUser={message.sender.id === currentUser?.id}
                />
              ))}
            </div>
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
          onSend={handleSendMessage}
          onVoiceInput={handleVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
        />
      </div>
    </div>
  );
}