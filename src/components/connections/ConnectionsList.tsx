
import { UserProfile } from "@/types/profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectionCard } from "./ConnectionCard";
import { EmptyConnectionsState } from "./EmptyConnectionsState";
import useConnections from "./hooks/useConnections";
import { PendingRequestsSection } from "./PendingRequestsSection";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useState, useEffect } from "react";

interface ConnectionsListProps {
  searchQuery: string;
  showPendingRequests: boolean;
  selectedProfile: UserProfile | null;
  onClose: () => void;
}

// Définir l'interface pour ConnectionCardProps
interface ConnectionCardProps {
  profile: UserProfile;
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
    totalConnections,
    handleLoadMore,
    hasMore
  } = useConnections();

  // Ajouter un état local pour stocker les erreurs éventuelles
  const [error, setError] = useState<Error | null>(null);

  // Créer une fonction pour charger plus de connexions si nécessaire
  const loadMoreConnections = () => {
    try {
      handleLoadMore();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement des connexions'));
    }
  };

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

  if (isLoading && (!connections || connections.length === 0)) {
    return (
      <div className="text-center py-8">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  // Transformer les connexions en profils utilisateur pour les passer à ConnectionCard
  const connectionsAsProfiles = filteredConnections.map(conn => ({
    id: conn.id,
    full_name: conn.full_name || '',
    avatar_url: conn.avatar_url,
    email: null,
    role: conn.role,
    bio: conn.bio,
    phone: null,
    city: conn.city,
    state: null,
    country: conn.country,
    skills: conn.skills || [],
    online_status: conn.online_status,
    last_seen: null,
    // Ajouter les propriétés manquantes pour satisfaire le type UserProfile
    experiences: [],
    education: [],
    certifications: conn.certifications || [],
    friends: []  // Propriété obligatoire
  } as UserProfile));

  return (
    <>
      <ScrollArea className="h-[500px] rounded-lg bg-zinc-900/30 p-4">
        {showPendingRequests && <PendingRequestsSection />}
        
        {connectionsAsProfiles?.length ? (
          <div className="space-y-2">
            {connectionsAsProfiles.map(profile => (
              <ConnectionCard 
                key={profile.id}
                profile={profile}
              />
            ))}
          </div>
        ) : (
          <EmptyConnectionsState showPendingRequests={showPendingRequests} />
        )}
        
        {hasMore && (
          <div className="text-center py-4">
            <button 
              onClick={loadMoreConnections}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Chargement...' : 'Voir plus'}
            </button>
          </div>
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
