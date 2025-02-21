
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
  role?: string;
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  skills?: string[];
  online_status?: boolean;
  last_seen?: string | null;
}

export function ConversationList({ className }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setReceiver, setShowConversation } = useReceiver();
  const { conversations, handleDeleteConversation } = useConversations();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Receiver | null>(null);
  const { friends, loadingFriends, loadFriends } = useFriendsList();

  const convertParticipantToReceiver = (participant: ConversationParticipant): Receiver => {
    return {
      id: participant.id,
      full_name: participant.full_name,
      avatar_url: participant.avatar_url || null,
      email: participant.email || null,
      role: (participant.role || 'professional') as 'professional' | 'business' | 'admin',
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

  const handleSelectConversation = (conversation: { participant: ConversationParticipant }) => {
    const receiver = convertParticipantToReceiver(conversation.participant);
    setReceiver(receiver);
    setShowConversation(true);
  };

  const handleParticipantClick = (participant: ConversationParticipant) => {
    const receiver = convertParticipantToReceiver(participant);
    setSelectedParticipant(receiver);
    setShowProfilePreview(true);
  };

  const startConversation = (friend: Receiver) => {
    setReceiver(friend);
    setShowConversation(true);
  };

  const convertReceiverToProfile = (receiver: Receiver): UserProfile => {
    return {
      id: receiver.id,
      email: receiver.email || "",
      full_name: receiver.full_name,
      avatar_url: receiver.avatar_url || undefined,
      role: receiver.role,
      bio: receiver.bio || undefined,
      phone: receiver.phone || undefined,
      city: receiver.city || undefined,
      state: receiver.state || undefined,
      country: receiver.country || undefined,
      skills: receiver.skills,
      online_status: receiver.online_status === 'online',
      last_seen: receiver.last_seen || undefined,
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
          onRequestChat={() => handleSelectConversation({ participant: selectedParticipant })}
        />
      )}
    </div>
  );
}
