import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { FriendRequestsSection } from "./FriendRequestsSection";
import { ConnectionsSection } from "./ConnectionsSection";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  return (
    <>
      <div className="mb-4">
        <ProfileSearch 
          onSelect={setSelectedProfile}
          placeholder="Rechercher quelqu'un..."
        />
      </div>

      <div className="space-y-6">
        <FriendRequestsSection />
        <ConnectionsSection />
      </div>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </>
  );
}