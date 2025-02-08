
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Receiver } from "@/types/messages";
import { SearchBar } from "./SearchBar";
import { ConversationItem } from "./ConversationItem";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          {/* AI Assistant - M. Victaure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 h-auto p-4 bg-primary/5 hover:bg-primary/10"
              onClick={() => onSelectConversation({
                id: 'assistant',
                full_name: 'M. Victaure',
                avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
                online_status: true,
                last_seen: new Date().toISOString()
              })}
            >
              <Bot className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">M. Victaure</h3>
                <p className="text-sm text-muted-foreground">Assistant virtuel</p>
              </div>
              {chatMessages.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {new Date(chatMessages[chatMessages.length - 1].created_at).toLocaleDateString()}
                </span>
              )}
            </Button>
          </motion.div>

          {/* User Conversations */}
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
