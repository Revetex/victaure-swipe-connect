
import { useState, useRef, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendSelector } from "./conversation/FriendSelector";
import { AssistantMessage } from "./conversation/AssistantMessage";
import { useUser } from "@/hooks/useUser";

export function MessagesContainer() {
  const { receiver, setReceiver, showConversation, setShowConversation } = useReceiver();
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  
  const { data: conversations = [], isLoading: isLoadingConversations } = useMessageQuery();
  const { data: currentMessages = [], isLoading: isLoadingMessages } = useConversationMessages(receiver);
  
  const { 
    messages: aiMessages, 
    handleSendMessage: handleAISendMessage,
    isThinking,
    setInputMessage: setAIInputMessage,
    handleJobAccept,
    handleJobReject
  } = useAIChat();
  
  const { handleDeleteConversation } = useConversationDelete();

  const handleSendMessage = async () => {
    if (!receiver || !inputMessage.trim() || !user) {
      toast.error("Une erreur est survenue");
      return;
    }

    if (receiver.id === 'assistant') {
      handleAISendMessage(inputMessage);
      setAIInputMessage('');
    } else {
      try {
        const messageData = {
          content: inputMessage,
          sender_id: user.id,
          receiver_id: receiver.id,
          is_assistant: false,
          message_type: 'user' as const,
          status: 'sent' as const,
          metadata: {
            timestamp: new Date().toISOString(),
            type: 'chat'
          }
        };

        // Insérer le message
        const { error: messageError } = await supabase
          .from('messages')
          .insert(messageData);

        if (messageError) throw messageError;

        // Vérifier si une conversation existe déjà
        const { data: existingConversation, error: fetchError } = await supabase
          .from('conversations')
          .select('*')
          .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
          .or(`participant1_id.eq.${receiver.id},participant2_id.eq.${receiver.id}`)
          .maybeSingle();

        if (fetchError) throw fetchError;

        // Si aucune conversation n'existe, en créer une nouvelle
        if (!existingConversation) {
          const { error: conversationError } = await supabase
            .from('conversations')
            .insert({
              participant1_id: user.id,
              participant2_id: receiver.id,
              last_message: inputMessage,
              last_message_time: new Date().toISOString()
            })
            .single();

          if (conversationError && conversationError.code !== '23505') {
            throw conversationError;
          }
        } else {
          // Mettre à jour la conversation existante
          const { error: updateError } = await supabase
            .from('conversations')
            .update({
              last_message: inputMessage,
              last_message_time: new Date().toISOString()
            })
            .match({ id: existingConversation.id });

          if (updateError) throw updateError;
        }

      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Erreur lors de l'envoi du message");
        return;
      }
    }
    
    setInputMessage('');
  };

  const handleStartNewChat = async (friendId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    try {
      // Vérifier si une conversation existe déjà
      const { data: existingConversation, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .or(`participant1_id.eq.${friendId},participant2_id.eq.${friendId}`)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Si aucune conversation n'existe, en créer une nouvelle
      if (!existingConversation) {
        const { error: conversationError } = await supabase
          .from('conversations')
          .insert({
            participant1_id: user.id,
            participant2_id: friendId
          })
          .single();

        if (conversationError && conversationError.code !== '23505') {
          throw conversationError;
        }
      }

      // Récupérer les informations de l'ami
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
            ...transformDatabaseMessage(msg as DatabaseMessage),
            message_type: msg.is_assistant ? 'assistant' : 'user'
          }))
        : []);

  return (
    <Card className="h-[calc(100vh-4rem)] flex flex-col mt-16">
      <div className="flex-1 flex flex-col h-full relative bg-gradient-to-b from-background to-muted/20">
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
          <div className="flex flex-col h-full">
            <div className="p-4 border-b space-y-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
              <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une conversation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <FriendSelector onSelectFriend={handleStartNewChat}>
                  <Button variant="default" size="icon" className="shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </FriendSelector>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <AssistantMessage 
                  chatMessages={aiMessages}
                  onSelectConversation={() => {
                    setReceiver({
                      id: 'assistant',
                      full_name: 'M. Victaure',
                      avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
                      online_status: true,
                      last_seen: new Date().toISOString()
                    });
                    setShowConversation(true);
                  }}
                />
                
                <div className="pt-2">
                  <ConversationList
                    conversations={filteredConversations}
                    onSelectConversation={(receiver) => {
                      setReceiver(receiver);
                      setShowConversation(true);
                    }}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </Card>
  );
}
