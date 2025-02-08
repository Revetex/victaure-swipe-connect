
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Receiver } from "@/types/messages";
import { SearchBar } from "./SearchBar";
import { ConversationItem } from "./ConversationItem";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";

export interface ConversationListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (receiver: Receiver) => void;
}

export function ConversationList({ 
  messages, 
  chatMessages, 
  onSelectConversation 
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useProfile();
  
  // Group messages by conversation (sender/receiver pair)
  const conversations = messages.reduce((acc: { user: Receiver; lastMessage: Message }[], message: Message) => {
    if (!profile || !message) {
      return acc;
    }
    
    if (message.sender_id === message.receiver_id) {
      return acc;
    }

    const otherUserId = message.sender_id === profile.id ? message.receiver_id : message.sender_id;
    const otherUser = message.sender_id === profile.id ? message.receiver : message.sender;

    if (!otherUser || !otherUserId) {
      return acc;
    }

    const existingConv = acc.find(conv => conv.user.id === otherUserId);
    
    if (!existingConv) {
      acc.push({
        user: {
          id: otherUserId,
          full_name: otherUser.full_name,
          avatar_url: otherUser.avatar_url || '',
          online_status: otherUser.online_status || false,
          last_seen: otherUser.last_seen || new Date().toISOString()
        },
        lastMessage: message
      });
    } else if (new Date(message.created_at) > new Date(existingConv.lastMessage.created_at)) {
      existingConv.lastMessage = message;
    }
    
    return acc;
  }, []);

  const filteredConversations = conversations.filter(conv => 
    conv.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedConversations = [...filteredConversations].sort((a, b) => 
    new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
  );

  return (
    <div className="flex flex-col h-full">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectFriend={(friendId) => onSelectConversation({
          id: friendId,
          full_name: '',
          avatar_url: '',
          online_status: false,
          last_seen: new Date().toISOString()
        })}
      />

      <ScrollArea className="flex-1 pt-4">
        <div className="px-4 space-y-4">
          {sortedConversations.length > 0 ? (
            <div className="space-y-2">
              {sortedConversations.map((conv, index) => (
                <motion.div
                  key={conv.user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ConversationItem
                    user={conv.user}
                    lastMessage={conv.lastMessage}
                    onSelect={() => onSelectConversation(conv.user)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation pour le moment'}
              </p>
              {!searchQuery && (
                <p className="text-xs text-muted-foreground mt-1">
                  Commencez une nouvelle conversation en cliquant sur le bouton +
                </p>
              )}
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
