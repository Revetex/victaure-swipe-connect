
import { motion } from "framer-motion";
import { ConversationHeader } from "./ConversationHeader";
import { AssistantMessage } from "./AssistantMessage";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { FriendSelector } from "./FriendSelector";
import { Message, Receiver } from "@/types/messages";

interface ConversationListProps {
  conversations: Message[];
  aiMessages: Message[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onSelectConversation: (receiver: Receiver) => void;
  onStartNewChat: (friendId: string) => void;
}

export function ConversationList({
  conversations,
  aiMessages,
  searchQuery,
  onSearchChange,
  onRefresh,
  onSelectConversation,
  onStartNewChat
}: ConversationListProps) {
  // Filtrer les conversations pour n'avoir qu'une seule conversation par utilisateur
  const uniqueConversations = conversations.reduce((acc, curr) => {
    // Ignorer les conversations avec l'assistant
    if (curr.receiver?.id === 'assistant') return acc;
    
    const existingConversation = acc.find(conv => conv.receiver?.id === curr.receiver?.id);
    if (!existingConversation) {
      acc.push(curr);
    } else if (new Date(curr.created_at) > new Date(existingConversation.created_at)) {
      // Garder la conversation la plus récente
      const index = acc.indexOf(existingConversation);
      acc[index] = curr;
    }
    return acc;
  }, [] as Message[]);

  // Trier les conversations par date de création, plus récent en premier
  const sortedConversations = uniqueConversations.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Filtrer les conversations selon la recherche
  const filteredConversations = sortedConversations.filter(conv => 
    conv.receiver?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const shouldScroll = filteredConversations.length > 8;

  return (
    <div className="relative h-full flex flex-col">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-20 p-4">
        <div className="flex items-center justify-between gap-2">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onRefresh}
              className="shrink-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <FriendSelector onSelectFriend={onStartNewChat}>
              <Button variant="default" size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </FriendSelector>
          </div>
        </div>
      </div>

      <div className={`flex-1 ${shouldScroll ? 'overflow-y-auto' : ''}`}>
        <div className="p-4 space-y-4">
          {/* M. Victaure toujours en premier et sticky */}
          <AssistantMessage 
            chatMessages={aiMessages}
            onSelectConversation={() => {
              onSelectConversation({
                id: 'assistant',
                full_name: 'M. Victaure',
                avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
                online_status: true,
                last_seen: new Date().toISOString()
              });
            }}
          />
          
          <div className="pt-2 space-y-2">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onSelectConversation(conversation.receiver)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {conversation.receiver?.avatar_url ? (
                      <img
                        src={conversation.receiver.avatar_url}
                        alt={conversation.receiver.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-primary">
                        {conversation.receiver?.full_name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {conversation.receiver?.full_name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.content}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(conversation.created_at).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
