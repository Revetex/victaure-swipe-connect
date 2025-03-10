import React, { useState } from "react";
import { ConnectionsSection } from "@/components/feed/friends/ConnectionsSection";
import { PendingRequestsSection } from "@/components/feed/friends/PendingRequestsSection";
import { ProfilePreviewCard } from "@/components/profile/preview/ProfilePreviewCard";
import { UserProfile } from "@/types/profile";

interface ConnectionsPageProps {
  searchQuery: string;
  showPendingRequests: boolean;
  onTogglePending: () => void;
}

export function ConnectionsPage({ searchQuery, showPendingRequests, onTogglePending }: ConnectionsPageProps) {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  return (
    <div className="flex flex-col h-full">
      <ConnectionsSection
        searchQuery={searchQuery}
        showPendingRequests={showPendingRequests}
        onTogglePending={onTogglePending}
      />

      {selectedProfile && (
        <ProfilePreviewCard 
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)} 
          isOpen={!!selectedProfile}
        />
      )}
    </div>
  );
}
