
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Receiver } from "@/types/messages";
import { useProfile } from "@/hooks/useProfile";
import { SearchBar } from "./SearchBar";
import { AssistantButton } from "./AssistantButton";
import { ConversationItem } from "./ConversationItem";
import { useNavigation } from "@/hooks/useNavigation";
import { DashboardNavigation } from "@/components/dashboard/navigation/DashboardNavigation";

export interface ConversationListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (receiver: Receiver) => void;
}

export function ConversationList({ messages, chatMessages, onSelectConversation }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useProfile();
  const { currentPage, handlePageChange } = useNavigation();
  
  const conversations = messages.reduce((acc: { user: Receiver; lastMessage: Message }[], message: Message) => {
    if (!profile || !message) return acc;
    
    // Skip self-messages
    if (message.sender_id === message.receiver_id) {
      return acc;
    }

    const otherUserId = message.sender_id === profile.id ? message.receiver_id : message.sender_id;
    const otherUser = message.sender_id === profile.id ? message.receiver : message.sender;

    // Ensure we have valid user data
    if (!otherUser || !otherUserId) {
      console.error("Missing user data for message:", message);
      return acc;
    }

    const existingConv = acc.find(conv => conv.user.id === otherUserId);
    
    if (!existingConv) {
      acc.push({
        user: {
          id: otherUserId,
          full_name: otherUser.full_name || 'Utilisateur',
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

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
        </div>
        <div className="border-b p-4">
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
      </div>

      {/* Scrollable Content */}
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

      {/* Fixed Footer Navigation */}
      <div className="sticky bottom-0 z-50 bg-background border-t">
        <DashboardNavigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isEditing={false}
        />
      </div>
    </div>
  );
}
