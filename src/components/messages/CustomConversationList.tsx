import React from "react";
import { Conversation } from "@/types/messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, UserPlusIcon, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomConversationListProps {
  conversations: Conversation[];
  searchQuery: string;
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading: boolean;
}

export function CustomConversationList({
  conversations,
  searchQuery,
  selectedConversationId,
  onSelectConversation,
  isLoading
}: CustomConversationListProps) {
  // Filtrer les conversations selon la recherche
  const filteredConversations = conversations.filter(conversation => {
    const participantName = conversation.participant?.full_name?.toLowerCase() || "";
    const lastMessage = conversation.last_message?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    
    return participantName.includes(query) || lastMessage.includes(query);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher..."
              className="pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => {/* Gestion de la recherche */}}
            />
          </div>
          <Button variant="outline" size="icon" title="Nouveau message">
            <UserPlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center p-2 gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Aucune conversation trouvée
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`flex items-center p-2 rounded-lg cursor-pointer ${
                  selectedConversationId === conversation.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                }`}
              >
                <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                  <AvatarImage src={conversation.participant?.avatar_url || ""} />
                  <AvatarFallback>
                    {conversation.participant?.full_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">
                      {conversation.participant?.full_name || "Utilisateur"}
                    </p>
                    {conversation.last_message_time && (
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(conversation.last_message_time), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message || "Aucun message"}
                  </p>
                  {conversation.unread_count ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full">
                      {conversation.unread_count}
                    </span>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
