
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

interface ConversationParticipant {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  email?: string | null;
  role?: 'professional' | 'business' | 'admin';
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  skills?: string[];
  online_status?: boolean;
  last_seen?: string | null;
  participant2_id?: string;
}

interface Conversation {
  id: string;
  participant: ConversationParticipant;
  last_message?: string;
  last_message_time?: string;
  participant2_id: string;
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
      role: participant.role || 'professional',
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

  const convertReceiverToProfile = (participant: ConversationParticipant): UserProfile => {
    return {
      id: participant.id,
      email: participant.email || "",
      full_name: participant.full_name,
      avatar_url: participant.avatar_url || undefined,
      role: participant.role || 'professional',
      bio: participant.bio || undefined,
      phone: participant.phone || undefined,
      city: participant.city || undefined,
      state: participant.state || undefined,
      country: participant.country || undefined,
      skills: participant.skills || [],
      online_status: !!participant.online_status,
      last_seen: participant.last_seen || undefined,
      certifications: [],
      education: [],
      experiences: [],
      friends: []
    };
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
          profile={convertReceiverToProfile(selectedParticipant)}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
          onRequestChat={() => handleSelectConversation({
            id: selectedParticipant.id,
            participant: selectedParticipant,
            participant2_id: selectedParticipant.participant2_id || selectedParticipant.id
          })}
        />
      )}
    </div>
  );
}
