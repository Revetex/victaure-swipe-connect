
import { useState } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ConversationSearch } from "./components/ConversationSearch";
import { ConversationItem } from "./components/ConversationItem";
import { useConversations, type Conversation } from "./hooks/useConversations";
import type { ConversationParticipant } from "./types/conversation.types";
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
  const [selectedParticipant, setSelectedParticipant] = useState<ConversationParticipant | null>(null);
  const { friends, loadingFriends, loadFriends } = useFriendsList();

  const convertParticipantToReceiver = (participant: ConversationParticipant): Receiver => {
    return {
      id: participant.id,
      full_name: participant.full_name,
      avatar_url: participant.avatar_url || null,
      email: participant.email || null,
      role: participant.role,
      bio: participant.bio || null,
      phone: participant.phone || null,
      city: participant.city || null,
      state: participant.state || null,
      country: participant.country || null,
      skills: participant.skills || [],
      online_status: participant.online_status ? 'online' : 'offline',
      last_seen: participant.last_seen || new Date().toISOString(),
      certifications: [],
      education: [],
      experiences: [],
      friends: [],
      latitude: null,
      longitude: null
    };
  };

  const handleSelectConversation = (conversation: Conversation) => {
    const receiver = convertParticipantToReceiver(conversation.participant);
    setReceiver(receiver);
    setShowConversation(true);
  };

  const handleParticipantClick = (participant: ConversationParticipant) => {
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
          profile={{
            id: selectedParticipant.id,
            email: selectedParticipant.email || "",
            full_name: selectedParticipant.full_name,
            avatar_url: selectedParticipant.avatar_url || undefined,
            role: selectedParticipant.role,
            bio: selectedParticipant.bio || undefined,
            phone: selectedParticipant.phone || undefined,
            city: selectedParticipant.city || undefined,
            state: selectedParticipant.state || undefined,
            country: selectedParticipant.country || undefined,
            skills: selectedParticipant.skills || [],
            online_status: !!selectedParticipant.online_status,
            last_seen: selectedParticipant.last_seen || undefined,
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          }}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
          onRequestChat={() => handleSelectConversation({
            id: selectedParticipant.id,
            participant: selectedParticipant,
            participant2_id: selectedParticipant.id,
            participant1_id: selectedParticipant.id,
            last_message: '',
            last_message_time: new Date().toISOString()
          })}
        />
      )}
    </div>
  );
}
