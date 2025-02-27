
import { UserProfile } from "@/types/profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectionCard } from "./ConnectionCard";
import { EmptyConnectionsState } from "./EmptyConnectionsState";
import useConnections from "./hooks/useConnections"; // Correction: import par défaut au lieu d'un import nommé
import { PendingRequestsSection } from "./PendingRequestsSection";
import { ProfilePreview } from "@/components/ProfilePreview";

interface ConnectionsListProps {
  searchQuery: string;
  showPendingRequests: boolean;
  selectedProfile: UserProfile | null;
  onClose: () => void;
}

export function ConnectionsList({
  searchQuery,
  showPendingRequests,
  selectedProfile,
  onClose
}: ConnectionsListProps) {
  const {
    connections,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useConnections();

  const filteredConnections = connections?.filter(connection => 
    connection.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Une erreur est survenue lors du chargement des connexions
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[500px] rounded-lg bg-zinc-900/30 p-4">
        {showPendingRequests && <PendingRequestsSection />}
        
        {filteredConnections?.length ? (
          <div className="space-y-2">
            {filteredConnections.map(connection => (
              <ConnectionCard 
                key={connection.id}
                connection={connection}
              />
            ))}
          </div>
        ) : (
          <EmptyConnectionsState showPendingRequests={showPendingRequests} />
        )}
      </ScrollArea>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={onClose}
        />
      )}
    </>
  );
}
