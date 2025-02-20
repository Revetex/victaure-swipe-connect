
import { useState, useRef } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { useMessageQuery } from "@/hooks/useMessageQuery";
import { useConversationMessages } from "@/hooks/useConversationMessages";
import { useAIChat } from "@/hooks/useAIChat";
import { useConversationDelete } from "@/hooks/useConversationDelete";
import { useConversationHandler } from "@/hooks/useConversationHandler";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, transformDatabaseMessage } from "@/types/messages";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

export function useMessagesContainer() {
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

  const messages: Message[] = receiver?.id === 'assistant' 
    ? aiMessages 
    : (Array.isArray(currentMessages) 
        ? currentMessages.map(msg => ({
            ...transformDatabaseMessage(msg),
            message_type: msg.is_assistant ? 'assistant' as const : 'user' as const
          }))
        : []);

  return {
    receiver,
    messages,
    filteredConversations,
    aiMessages,
    inputMessage,
    isThinking,
    searchQuery,
    showConversation,
    messagesEndRef,
    setInputMessage,
    setSearchQuery,
    handleSendMessage,
    handleStartNewChat,
    handleRefresh,
    handleDeleteConversation,
    setShowConversation,
    setReceiver
  };
}
