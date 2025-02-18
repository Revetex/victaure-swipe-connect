import { useState, useRef } from "react";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { useReceiver } from "@/hooks/useReceiver";
import { useMessageQuery } from "@/hooks/useMessageQuery";
import { useConversationMessages } from "@/hooks/useConversationMessages";
import { useAIChat } from "@/hooks/useAIChat";
import { useConversationDelete } from "@/hooks/useConversationDelete";
import { useConversationHandler } from "@/hooks/useConversationHandler";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, DatabaseMessage, transformDatabaseMessage } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendSelector } from "./conversation/FriendSelector";
import { AssistantMessage } from "./conversation/AssistantMessage";
import { SearchBar } from "./conversation/SearchBar";
import { useUser } from "@/hooks/useUser";

export function MessagesContainer() {
  const { receiver, setReceiver, showConversation, setShowConversation } = useReceiver();
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { sendMessage, createOrUpdateConversation } = useConversationHandler();
  
  const { data: conversations = [] } = useMessageQuery();
  const { data: currentMessages = [] } = useConversationMessages(receiver);
  
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
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
