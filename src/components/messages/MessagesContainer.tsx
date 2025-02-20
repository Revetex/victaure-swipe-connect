
import { useState, useRef } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { useMessageQuery } from "@/hooks/useMessageQuery";
import { useConversationMessages } from "@/hooks/useConversationMessages";
import { useAIChat } from "@/hooks/useAIChat";
import { useConversationDelete } from "@/hooks/useConversationDelete";
import { useConversationHandler } from "@/hooks/useConversationHandler";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { transformDatabaseMessage } from "@/types/messages";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { ConversationView } from "./conversation/ConversationView";
import { ConversationList } from "./conversation/ConversationList";

export function MessagesContainer() {
  const { receiver, setReceiver, showConversation, setShowConversation } = useReceiver();
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { sendMessage, createOrUpdateConversation } = useConversationHandler();
  
  const { data: conversations = [] } = useMessageQuery();
  const { data: currentMessages = [] } = useConversationMessages(receiver);
  
  const { 
    messages: aiMessages, 
    handleSendMessage: handleAISendMessage,
    isThinking,
    setInputMessage: setAIInputMessage
  } = useAIChat();
  
  const { handleDeleteConversation } = useConversationDelete();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["messages"] });
    toast.success("Messages actualisés");
  };

  const handleSendMessage = async () => {
    if (!receiver || !inputMessage.trim() || !user) {
      toast.error("Une erreur est survenue");
      return;
    }

    try {
      if (receiver.id === 'assistant') {
        handleAISendMessage(inputMessage);
        setAIInputMessage('');
      } else {
        await sendMessage(inputMessage, user.id, receiver.id);
      }
      setInputMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const handleStartNewChat = async (friendId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    try {
      await createOrUpdateConversation(user.id, friendId);

      const { data: friend, error: friendError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', friendId)
        .single();

      if (friendError || !friend) {
        throw new Error("Impossible de trouver cet utilisateur");
      }

      setReceiver(friend);
      setShowConversation(true);
    } catch (error) {
      console.error('Error starting new chat:', error);
      toast.error("Erreur lors de la création de la conversation");
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.sender?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.receiver?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const messages = receiver?.id === 'assistant' 
    ? aiMessages 
    : (Array.isArray(currentMessages) 
        ? currentMessages.map(msg => ({
            ...transformDatabaseMessage(msg),
            message_type: msg.is_assistant ? 'assistant' : 'user'
          }))
        : []);

  return (
    <Card className="h-[calc(100vh-4rem)] flex flex-col mt-16">
      <div className="flex-1 flex flex-col h-full relative bg-gradient-to-b from-background to-muted/20">
        {showConversation && receiver ? (
          <ConversationView
            messages={messages}
            receiver={receiver}
            inputMessage={inputMessage}
            isThinking={isThinking}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
            onBack={() => {
              setShowConversation(false);
              setReceiver(null);
            }}
            onDelete={() => handleDeleteConversation(receiver)}
            messagesEndRef={messagesEndRef}
          />
        ) : (
          <ConversationList
            conversations={filteredConversations}
            aiMessages={aiMessages}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={handleRefresh}
            onSelectConversation={(receiver) => {
              setReceiver(receiver);
              setShowConversation(true);
            }}
            onStartNewChat={handleStartNewChat}
          />
        )}
      </div>
    </Card>
  );
}
