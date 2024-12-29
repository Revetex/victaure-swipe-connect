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
import { MessageList } from "@/components/messages/MessageList";
import { useQuery } from "@tanstack/react-query";

export function MessagesTab() {
  const [showConversationList, setShowConversationList] = useState(true);
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

  // Fetch matched users
  const { data: matchedUsers } = useQuery({
    queryKey: ['matched-users'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: matches } = await supabase
        .from('matches')
        .select(`
          professional_id,
          employer_id,
          profiles!matches_professional_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .or(`professional_id.eq.${user.id},employer_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (!matches) return [];

      const userIds = matches.map(match => 
        match.professional_id === user.id ? match.employer_id : match.professional_id
      );

      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      return users || [];
    }
  });

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

  if (showConversationList) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4">
        {/* Mr Victaure (Pinned) */}
        <div 
          onClick={() => setShowConversationList(false)}
          className="flex items-center p-4 space-x-4 bg-primary/5 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors"
        >
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Mr Victaure</h3>
            <p className="text-sm text-muted-foreground">Assistant IA Personnel</p>
          </div>
        </div>

        {/* Matched Users */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground px-2">Conversations</h4>
          {matchedUsers?.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-4 space-x-4 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => {
                // TODO: Implement user chat
                console.log("Open chat with user:", user.id);
              }}
            >
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                ) : (
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{user.full_name}</h3>
                <p className="text-sm text-muted-foreground">Cliquez pour discuter</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        isThinking={isThinking} 
        onClearChat={clearChat}
        onBack={() => setShowConversationList(true)}
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