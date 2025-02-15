
import { useState, useRef } from "react";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { useReceiver } from "@/hooks/useReceiver";
import { useMessageQuery } from "@/hooks/useMessageQuery";
import { useConversationMessages } from "@/hooks/useConversationMessages";
import { useAIChat } from "@/hooks/useAIChat";
import { useConversationDelete } from "@/hooks/useConversationDelete";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, DatabaseMessage, transformDatabaseMessage } from "@/types/messages";
import { Json } from "@/types/database/auth";

export function MessagesContainer() {
  const { receiver, setReceiver, showConversation, setShowConversation } = useReceiver();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: conversations = [], isLoading: isLoadingConversations } = useMessageQuery();
  const { data: currentMessages = [], isLoading: isLoadingMessages } = useConversationMessages(receiver);
  
  const { 
    messages: aiMessages, 
    handleSendMessage: handleAISendMessage,
    isThinking,
    setInputMessage: setAIInputMessage
  } = useAIChat();
  
  const { handleDeleteConversation } = useConversationDelete();

  const handleSendMessage = async () => {
    if (!receiver || !inputMessage.trim()) return;

    if (receiver.id === 'assistant') {
      handleAISendMessage(inputMessage);
      setAIInputMessage('');
    } else {
      const messageData = {
        content: inputMessage,
        receiver_id: receiver.id,
        is_assistant: false,
        message_type: 'user' as const,
        status: 'sent' as const,
        metadata: {
          timestamp: new Date().toISOString(),
          type: 'chat'
        } as Record<string, Json>
      };

      const { error } = await supabase.from('messages').insert(messageData);

      if (error) {
        toast.error("Erreur lors de l'envoi du message");
        return;
      }
    }
    
    setInputMessage('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const messages = receiver?.id === 'assistant' 
    ? aiMessages 
    : Array.isArray(currentMessages) 
      ? currentMessages.map(msg => transformDatabaseMessage(msg as DatabaseMessage))
      : [];

  return (
    <Card className="h-[calc(100vh-4rem)]">
      <div className="h-full">
        {showConversation && receiver ? (
          <ConversationView
            receiver={receiver}
            messages={messages}
            inputMessage={inputMessage}
            isThinking={isThinking}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
            onBack={() => {
              setShowConversation(false);
              setReceiver(null);
            }}
            onDeleteConversation={() => handleDeleteConversation(receiver)}
            messagesEndRef={messagesEndRef}
          />
        ) : (
          <ConversationList
            conversations={conversations}
            onSelectConversation={(receiver) => {
              setReceiver(receiver);
              setShowConversation(true);
            }}
          />
        )}
      </div>
    </Card>
  );
}
