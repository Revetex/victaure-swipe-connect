
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message, Receiver } from "@/types/messages";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { filterMessages } from "@/utils/messageUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FriendSelector } from "./FriendSelector";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface ConversationListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (receiver: Receiver) => void;
}

export function ConversationList({ messages, chatMessages, onSelectConversation }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useProfile();
  
  // Filter out self-conversations and group remaining messages by sender/receiver
  const conversations = messages.reduce((acc: any[], message: Message) => {
    if (!profile) return acc;
    
    // Skip self-conversations
    if (message.sender_id === message.receiver_id) {
      return acc;
    }

    // Determine the other user in the conversation
    const otherUserId = message.sender_id === profile.id ? message.receiver_id : message.sender_id;
    const otherUser = message.sender_id === profile.id 
      ? { id: message.receiver_id }
      : message.sender;
    
    if (!otherUser) return acc;
    
    // Find or create conversation entry
    const existingConv = acc.find((conv: any) => conv.user.id === otherUserId);
    if (!existingConv) {
      acc.push({
        user: {
          id: otherUserId,
          full_name: message.sender?.full_name || 'Utilisateur',
          avatar_url: message.sender?.avatar_url,
          online_status: message.sender?.online_status || false,
          last_seen: message.sender?.last_seen || new Date().toISOString()
        },
        lastMessage: message
      });
    } else if (new Date(message.created_at) > new Date(existingConv.lastMessage.created_at)) {
      existingConv.lastMessage = message;
    }
    return acc;
  }, []);

  const filteredConversations = conversations.filter(conv => 
    conv.user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <FriendSelector onSelectFriend={(friendId) => onSelectConversation({
          id: friendId,
          full_name: '',
          avatar_url: '',
          online_status: false,
          last_seen: new Date().toISOString()
        })}>
          <Button variant="outline" size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </FriendSelector>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* M. Victaure - Assistant */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 h-auto p-4 bg-primary/5 hover:bg-primary/10"
              onClick={() => onSelectConversation({
                id: 'assistant',
                full_name: 'M. Victaure',
                avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
                online_status: true,
                last_seen: new Date().toISOString()
              })}
            >
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage 
                  src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" 
                  alt="M. Victaure" 
                />
                <AvatarFallback>MV</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg text-primary">M. Victaure</h3>
                  {chatMessages.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(chatMessages[chatMessages.length - 1].created_at), 'PP', { locale: fr })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Assistant virtuel</p>
              </div>
            </Button>
          </div>

          {filteredConversations.length > 0 && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Conversations privées
                </span>
              </div>
            </div>
          )}

          {/* Conversations avec d'autres utilisateurs */}
          {filteredConversations.map((conv) => (
            <motion.div
              key={conv.user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 h-auto p-4 hover:bg-muted/50"
                onClick={() => onSelectConversation(conv.user)}
              >
                <Avatar className="h-12 w-12 ring-2 ring-muted">
                  <AvatarImage src={conv.user.avatar_url || undefined} alt={conv.user.full_name} />
                  <AvatarFallback>
                    {conv.user.full_name?.slice(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-base">{conv.user.full_name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(conv.lastMessage.created_at), 'PP', { locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {conv.lastMessage.content}
                  </p>
                </div>
              </Button>
            </motion.div>
          ))}

          {filteredConversations.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Aucune conversation trouvée
              </p>
            </div>
          )}

          {filteredConversations.length === 0 && !searchQuery && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Aucune conversation pour le moment
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Commencez une nouvelle conversation en cliquant sur le bouton +
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
