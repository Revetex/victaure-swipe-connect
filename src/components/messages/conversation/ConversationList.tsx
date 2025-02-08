
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Receiver } from "@/types/messages";
import { useProfile } from "@/hooks/useProfile";
import { SearchBar } from "./SearchBar";
import { AssistantButton } from "./AssistantButton";
import { ConversationItem } from "./ConversationItem";
import { motion } from "framer-motion";

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
    
    // Skip self-messages and AI messages
    if (message.sender_id === message.receiver_id || 
        message.sender_id === 'assistant' || 
        message.receiver_id === 'assistant') {
      return acc;
    }

    // Determine the other user in the conversation
    const otherUserId = message.sender_id === profile.id ? message.receiver_id : message.sender_id;
    const otherUser = message.sender_id === profile.id ? message.receiver : message.sender;

    // Ensure we have valid user data
    if (!otherUser || !otherUserId) {
      console.log("Missing user data for message:", message);
      return acc;
    }

    // Check if conversation already exists in accumulator
    const existingConv = acc.find(conv => conv.user.id === otherUserId);
    
    if (!existingConv) {
      // Add new conversation with this message
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
      // Update last message if this one is more recent
      existingConv.lastMessage = message;
    }
    
    return acc;
  }, []);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort conversations by last message date (most recent first)
  const sortedConversations = [...filteredConversations].sort((a, b) => 
    new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
  );

  // Get last AI message if exists
  const lastAIMessage = chatMessages[chatMessages.length - 1];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="sticky top-0 z-[100] bg-background pt-4">
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
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-muted/20 rounded-lg p-2"
          >
            <AssistantButton
              chatMessages={chatMessages}
              onSelect={() => onSelectConversation({
                id: 'assistant',
                full_name: 'M. Victaure',
                avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
                online_status: true,
                last_seen: new Date().toISOString()
              })}
            />
          </motion.div>

          {sortedConversations.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Conversations privées
                </span>
              </div>
            </motion.div>
          )}

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

          {filteredConversations.length === 0 && searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-sm text-muted-foreground">
                Aucune conversation trouvée
              </p>
            </motion.div>
          )}

          {filteredConversations.length === 0 && !searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-sm text-muted-foreground">
                Aucune conversation pour le moment
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Commencez une nouvelle conversation en cliquant sur le bouton +
              </p>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
