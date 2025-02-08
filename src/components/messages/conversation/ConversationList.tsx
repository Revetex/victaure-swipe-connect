
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Receiver } from "@/types/messages";
import { useProfile } from "@/hooks/useProfile";
import { SearchBar } from "./SearchBar";
import { AssistantButton } from "./AssistantButton";
import { ConversationItem } from "./ConversationItem";

export interface ConversationListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (receiver: Receiver) => void;
}

export function ConversationList({ messages, chatMessages, onSelectConversation }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useProfile();
  
  const conversations = messages.reduce((acc: any[], message: Message) => {
    if (!profile) return acc;
    
    // Skip self-messages
    if (message.sender_id === message.receiver_id) {
      return acc;
    }

    const otherUserId = message.sender_id === profile.id ? message.receiver_id : message.sender_id;
    const otherUser = message.sender_id === profile.id ? message.receiver : message.sender;

    // Skip if we don't have valid user information
    if (!otherUser || !otherUserId || !otherUser.id) {
      return acc;
    }
    
    const existingConv = acc.find((conv: any) => conv.user?.id === otherUserId);
    if (!existingConv) {
      acc.push({
        user: otherUser,
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

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] mt-16">
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

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
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

          {filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.user.id}
              user={conv.user}
              lastMessage={conv.lastMessage}
              onSelect={() => onSelectConversation(conv.user)}
            />
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
