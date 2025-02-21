
import { useState } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ConversationSearch } from "./components/ConversationSearch";
import { ConversationItem } from "./components/ConversationItem";
import { useConversations } from "./hooks/useConversations";
import { ProfilePreview } from "@/components/ProfilePreview";
import { NewConversationPopover } from "./components/NewConversationPopover";
import { useFriendsList } from "./hooks/useFriendsList";
import type { Receiver } from "@/types/messages";
import type { UserProfile } from "@/types/profile";

interface ConversationListProps {
  className?: string;
}

export function ConversationList({ className }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setReceiver, setShowConversation } = useReceiver();
  const { conversations, handleDeleteConversation } = useConversations();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Receiver | null>(null);
  const { friends, loadingFriends, loadFriends } = useFriendsList();

  const handleSelectConversation = (conversation: any) => {
    const receiver: Receiver = {
      ...conversation.participant,
      online_status: conversation.participant.online_status ? 'online' as const : 'offline' as const,
      last_seen: new Date().toISOString(),
      certifications: [],
      education: [],
      experiences: [],
      friends: [],
      avatar_url: conversation.participant.avatar_url || null,
      email: conversation.participant.email || null,
      bio: conversation.participant.bio || null,
      phone: conversation.participant.phone || null,
      city: conversation.participant.city || null,
      state: conversation.participant.state || null,
      country: conversation.participant.country || null,
      latitude: null,
      longitude: null,
      skills: conversation.participant.skills || []
    };
    
    setReceiver(receiver);
    setShowConversation(true);
  };

  const handleParticipantClick = (participant: Receiver) => {
    setSelectedParticipant(participant);
    setShowProfilePreview(true);
  };

  const startConversation = (friend: Receiver) => {
    setReceiver(friend);
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
          <NewConversationPopover
            onLoadFriends={loadFriends}
            friends={friends}
            loadingFriends={loadingFriends}
            onSelectFriend={startConversation}
          />
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
              onParticipantClick={() => handleParticipantClick(conversation.participant as Receiver)}
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
          profile={selectedParticipant as unknown as UserProfile}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
          onRequestChat={() => handleSelectConversation({ participant: selectedParticipant })}
        />
      )}
    </div>
  );
}
