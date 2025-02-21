
import { useState } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { ConversationSearch } from "./components/ConversationSearch";
import { ConversationItem } from "./components/ConversationItem";
import { useConversations } from "./hooks/useConversations";
import { ProfilePreview } from "@/components/ProfilePreview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Friend {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status: boolean;
}

interface ConversationListProps {
  className?: string;
}

export function ConversationList({ className }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setReceiver, setShowConversation } = useReceiver();
  const navigate = useNavigate();
  const { conversations, handleDeleteConversation } = useConversations();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const handleSelectConversation = (conversation: any) => {
    const receiver = {
      ...conversation.participant,
      online_status: conversation.participant.online_status ? 'online' : 'offline'
    };
    
    setReceiver(receiver);
    setShowConversation(true);
  };

  const handleParticipantClick = (participant: any) => {
    setSelectedParticipant(participant);
    setShowProfilePreview(true);
  };

  const loadFriends = async () => {
    try {
      setLoadingFriends(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: friendships, error } = await supabase
        .from('friendships')
        .select(`
          friend_id,
          friend:profiles!friendships_friend_id_fkey (
            id,
            full_name,
            avatar_url,
            online_status
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      const friendsList = friendships
        ?.map(friendship => friendship.friend)
        .filter((friend): friend is Friend => friend !== null) || [];

      setFriends(friendsList);
    } catch (error) {
      console.error('Error loading friends:', error);
      toast.error("Impossible de charger vos amis");
    } finally {
      setLoadingFriends(false);
    }
  };

  const startConversation = (friend: Friend) => {
    const receiver = {
      ...friend,
      online_status: friend.online_status ? 'online' : 'offline'
    };
    
    setReceiver(receiver);
    setShowConversation(true);
  };

  return (
    <div className={cn("flex flex-col border-r pt-20", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <ConversationSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0"
                onClick={loadFriends}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Nouvelle conversation</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-2">
                <h3 className="font-medium px-2 py-1">Démarrer une conversation</h3>
                {loadingFriends ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Chargement...
                  </div>
                ) : friends.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Aucun ami trouvé
                  </div>
                ) : (
                  <ScrollArea className="h-72">
                    {friends.map((friend) => (
                      <Button
                        key={friend.id}
                        variant="ghost"
                        className="w-full justify-start gap-2 p-2"
                        onClick={() => startConversation(friend)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={friend.avatar_url || undefined} />
                          <AvatarFallback>
                            {friend.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{friend.full_name}</span>
                      </Button>
                    ))}
                  </ScrollArea>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              participant={conversation.participant}
              lastMessage={conversation.last_message}
              lastMessageTime={conversation.last_message_time}
              onSelect={() => handleSelectConversation(conversation)}
              onParticipantClick={() => handleParticipantClick(conversation.participant)}
              onDelete={(e) => {
                e.stopPropagation();
                handleDeleteConversation(conversation.id, conversation.participant2_id);
              }}
            />
          ))}
        </div>
      </ScrollArea>

      {selectedParticipant && (
        <ProfilePreview
          profile={selectedParticipant}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
          onRequestChat={() => handleSelectConversation({ participant: selectedParticipant })}
        />
      )}
    </div>
  );
}
