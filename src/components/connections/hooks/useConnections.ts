
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Friend, Certification } from '@/types/profile';
import { UserRole } from '@/types/messages';

interface Connection {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  city: string | null;
  country: string | null;
  online_status: boolean;
  certifications: Certification[];
  bio: string | null;
  role: UserRole;
  score?: number;
}

export default function useConnections() {
  const [isLoading, setIsLoading] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [totalConnections, setTotalConnections] = useState(0);
  const [page, setPage] = useState(1);

  // Suggestions d'amis basées sur les compétences et l'emplacement
  const {
    data: suggestedConnections = [],
    isLoading: isSuggestionsLoading,
    refetch: refetchSuggestions
  } = useQuery({
    queryKey: ['suggested-connections'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const limit = 10;
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          full_name, 
          avatar_url, 
          skills, 
          city, 
          country, 
          online_status,
          bio,
          role
        `)
        .neq('id', user.id)
        .limit(limit);

      if (error) {
        console.error("Error fetching suggestions:", error);
        return [];
      }

      // Obtenir les IDs des amis actuels pour les filtrer
      const { data: friendRequests } = await supabase
        .from('friend_requests')
        .select('sender_id, receiver_id, status')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      
      // Obtenir les IDs des utilisateurs bloqués
      const { data: blockedUsers } = await supabase
        .from('blocked_users')
        .select('blocked_id, blocker_id')
        .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`);

      // Filtrer les amis existants
      const friendIds = new Set();
      const blockedIds = new Set();
      
      (friendRequests || []).forEach((request) => {
        if (request.status === 'accepted') {
          if (request.sender_id === user.id) {
            friendIds.add(request.receiver_id);
          } else {
            friendIds.add(request.sender_id);
          }
        } else if (request.status === 'pending') {
          // Ajouter également les demandes en attente pour ne pas les suggérer
          if (request.sender_id === user.id) {
            friendIds.add(request.receiver_id);
          } else {
            friendIds.add(request.sender_id);
          }
        }
      });
      
      // Ajouter les IDs bloqués au set
      (blockedUsers || []).forEach((blocked) => {
        if (blocked.blocker_id === user.id) {
          blockedIds.add(blocked.blocked_id);
        } else {
          blockedIds.add(blocked.blocker_id);
        }
      });

      // Maintenant, filtrer les suggestions pour exclure les amis et les utilisateurs bloqués
      const filtered = (data || []).filter(connection => 
        !friendIds.has(connection.id) && !blockedIds.has(connection.id)
      );

      // Convertir et faire une copie pour que ça marche avec TypeScript
      return filtered.map(conn => {
        // Vérifier et corriger le rôle si nécessaire
        const validRoles: UserRole[] = ['professional', 'business', 'admin'];
        const role: UserRole = validRoles.includes(conn.role as UserRole) 
          ? (conn.role as UserRole) 
          : 'professional';
          
        return {
          ...conn,
          role, // Assurer le typage correct
          certifications: [], // Ajouter les propriétés manquantes avec des valeurs par défaut
          website: null,
        };
      }) as Connection[];
    }
  });

  // Gérer la pagination des connexions
  useEffect(() => {
    if (page === 1) return; // Initial load is handled by the query
    
    const loadMoreConnections = async () => {
      setIsLoading(true);
      try {
        // Implémenter l'appel pour plus de données ici
        await refetchSuggestions();
      } catch (error) {
        console.error("Error loading more connections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMoreConnections();
  }, [page, refetchSuggestions]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleSendFriendRequest = async (connectionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: connectionId,
          status: 'pending'
        })
        .select();

      if (error) throw error;

      toast.success("Demande d'ami envoyée");
      refetchSuggestions();
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
    }
  };

  return {
    connections: suggestedConnections,
    isLoading: isLoading || isSuggestionsLoading,
    totalConnections,
    handleLoadMore,
    hasMore: connections.length < totalConnections,
    handleSendFriendRequest
  };
}
