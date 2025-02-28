
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

export const useConnections = () => {
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friends", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data: connections, error } = await friendRequestsAdapter.findAcceptedConnections(currentUser.id);
      
      if (error) {
        console.error("Error fetching friends:", error);
        return [];
      }
      
      if (!connections) return [];
      
      return connections.map(connection => {
        // Déterminer quel profil représente l'ami
        const friendProfile = connection.sender_id === currentUser.id 
          ? connection.receiver 
          : connection.sender;
          
        if (!friendProfile) {
          return {
            id: "",
            full_name: "Utilisateur inconnu",
            avatar_url: "",
            online_status: false,
            last_seen: new Date().toISOString(),
            email: "",
            country: "Canada",
            role: "professional",
            skills: [],
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          } as UserProfile;
        }
        
        return {
          id: friendProfile.id,
          full_name: friendProfile.full_name || "Utilisateur",
          avatar_url: friendProfile.avatar_url || "",
          online_status: friendProfile.online_status || false,
          last_seen: friendProfile.last_seen || new Date().toISOString(),
          // Autres propriétés par défaut
          email: "",
          country: "Canada",
          role: "professional",
          skills: [],
          certifications: [],
          education: [],
          experiences: [],
          friends: []
        } as UserProfile;
      });
    },
    enabled: !!currentUser,
  });

  const { data: pendingRequests = [], isLoading: isLoadingPending } = useQuery({
    queryKey: ["pending-requests", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data: connections, error } = await friendRequestsAdapter.findPendingRequests(currentUser.id);
      
      if (error) {
        console.error("Error fetching pending requests:", error);
        return [];
      }
      
      if (!connections) return [];
      
      return connections.map(request => {
        // Déterminer si la demande est entrante ou sortante
        const isIncoming = request.receiver_id === currentUser.id;
        const otherUser = isIncoming ? request.sender : request.receiver;
        
        if (!otherUser) {
          return {
            id: request.id,
            userId: isIncoming ? request.sender_id : request.receiver_id,
            fullName: "Utilisateur inconnu",
            avatarUrl: "",
            type: isIncoming ? "incoming" : "outgoing",
            createdAt: request.created_at
          };
        }
        
        return {
          id: request.id,
          userId: otherUser.id,
          fullName: otherUser.full_name || "Utilisateur",
          avatarUrl: otherUser.avatar_url || "",
          type: isIncoming ? "incoming" : "outgoing",
          createdAt: request.created_at
        };
      });
    },
    enabled: !!currentUser,
  });

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await friendRequestsAdapter.acceptFriendRequest(requestId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error("Error accepting request:", error);
      return { success: false, error };
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const { error } = await friendRequestsAdapter.deleteFriendRequest(requestId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting request:", error);
      return { success: false, error };
    }
  };

  return {
    friends,
    pendingRequests,
    isLoading: isLoadingFriends || isLoadingPending,
    handleAcceptRequest,
    handleDeleteRequest,
  };
};
