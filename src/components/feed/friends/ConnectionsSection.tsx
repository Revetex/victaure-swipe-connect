
import { useState } from "react";
import { ConnectionsPagination } from "./ConnectionsPagination";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { cn } from "@/lib/utils";
import { PendingRequestsSection } from "./PendingRequestsSection";
import { FriendList } from "./FriendList";
import { FriendListHeader } from "./FriendListHeader";

interface ConnectionsSectionProps {
  searchQuery: string;
  onTogglePending: () => void;
  showPendingRequests: boolean;
}

export function ConnectionsSection({ searchQuery, onTogglePending, showPendingRequests }: ConnectionsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { pendingRequests, refetchPendingRequests } = useFriendRequests();

  return (
    <div
      className={cn(
        "flex flex-col w-full grow space-y-6",
        "p-0 lg:p-0"
      )}
    >
      <PendingRequestsSection showPendingRequests={showPendingRequests} onToggle={onTogglePending} />

      <div className="flex flex-col grow space-y-3">
        <FriendListHeader 
          showOnlineOnly={showOnlineOnly} 
          setShowOnlineOnly={setShowOnlineOnly} 
          pendingCount={pendingRequests.length} 
          onTogglePending={onTogglePending}
        />
        <FriendList 
          showOnlineOnly={showOnlineOnly} 
          searchQuery={searchQuery} 
          currentPage={currentPage}
          itemsPerPage={8}
        />
        <ConnectionsPagination 
          currentPage={currentPage} 
          totalPages={5} 
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
