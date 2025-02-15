
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
import { Json } from "@/types/database/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendSelector } from "./conversation/FriendSelector";
import { AssistantMessage } from "./conversation/AssistantMessage";

export function MessagesContainer() {
  const { receiver, setReceiver, showConversation, setShowConversation } = useReceiver();
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages, aiMessages]);

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

  const handleStartNewChat = async (friendId: string) => {
    try {
      const { data: friend, error: friendError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', friendId)
        .single();

      if (friendError || !friend) {
        toast.error("Impossible de trouver cet utilisateur");
        return;
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
    <Card className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 flex flex-col h-full relative">
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
            <div className="p-4 border-b space-y-4">
              <div className="flex gap-2">
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
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </FriendSelector>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
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
