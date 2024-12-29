import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatConversation } from "./ChatConversation";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function AIAssistant() {
  const [currentUser, setCurrentUser] = useState<any>(null);
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

  const formattedMessages = assistantMessages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender: {
      id: msg.sender === 'assistant' ? 'assistant' : currentUser?.id,
      full_name: msg.sender === 'assistant' ? 'Mr Victaure' : currentUser?.full_name || 'Vous',
      avatar_url: msg.sender === 'assistant' ? '/bot-avatar.png' : currentUser?.avatar_url
    },
    created_at: msg.timestamp.toISOString(),
    read: true
  }));

  const messagesByDate = formattedMessages.reduce((groups, message) => {
    const date = new Date(message.created_at);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(message);
    return groups;
  }, {} as Record<string, typeof formattedMessages>);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        isThinking={isThinking} 
        onClearChat={clearChat}
      />

      <ChatConversation 
        messagesByDate={messagesByDate}
        currentUser={currentUser}
        isThinking={isThinking}
      />

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