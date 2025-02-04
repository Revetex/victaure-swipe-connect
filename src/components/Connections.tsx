import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { FriendRequestsSection } from "./feed/friends/FriendRequestsSection";
import { ConnectionsSection } from "./feed/friends/ConnectionsSection";

export function Connections() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-6">
        {/* Search Profile Section */}
        <div className="mb-4">
          <ProfileSearch 
            onSelect={setSelectedProfile}
            placeholder="Rechercher un profil..."
          />
        </div>

        {/* Connections Section */}
        <div className="space-y-2">
          <ConnectionsSection />
        </div>

        {/* Friend Requests Section */}
        <div className="space-y-2">
          <FriendRequestsSection />
        </div>
      </div>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}