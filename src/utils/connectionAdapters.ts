
import { supabase } from "@/integrations/supabase/client";

/**
 * Adaptateur unifié pour les demandes d'amis et connexions utilisateur
 */
export const connectionAdapter = {
  // Chercher les connexions acceptées
  async findAcceptedConnections(userId: string) {
    return supabase
      .from('user_connections')
      .select(`
        id,
        sender_id,
        receiver_id,
        status,
        created_at,
        updated_at,
        sender:profiles!user_connections_sender_id_fkey(
          id,
          full_name,
          avatar_url,
          online_status,
          last_seen
        ),
        receiver:profiles!user_connections_receiver_id_fkey(
          id,
          full_name,
          avatar_url,
          online_status,
          last_seen
        )
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted')
      .eq('connection_type', 'friend');
  },

  // Chercher les demandes en attente
  async findPendingRequests(userId: string) {
    return supabase
      .from('user_connections')
      .select(`
        id,
        sender_id,
        receiver_id,
        status,
        created_at,
        updated_at,
        sender:profiles!user_connections_sender_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        receiver:profiles!user_connections_receiver_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'pending')
      .eq('connection_type', 'friend');
  },

  // Créer une demande de connexion
  async createConnectionRequest(senderId: string, receiverId: string) {
    return supabase
      .from('user_connections')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'pending',
        connection_type: 'friend'
      });
  },

  // Accepter une demande de connexion
  async acceptConnectionRequest(requestId: string) {
    return supabase
      .from('user_connections')
      .update({ 
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
  },

  // Rejeter/Supprimer une demande de connexion
  async deleteConnectionRequest(requestId: string) {
    return supabase
      .from('user_connections')
      .delete()
      .eq('id', requestId);
  },

  // Vérifier le statut de connexion entre deux utilisateurs
  async checkConnectionStatus(userId: string, profileId: string) {
    const { data } = await supabase
      .from('user_connections')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${userId})`)
      .eq('connection_type', 'friend');
    
    if (!data || data.length === 0) return { isConnected: false, isPending: false, isSender: false };
    
    const isPending = data.some(conn => conn.status === 'pending');
    const isConnected = data.some(conn => conn.status === 'accepted');
    const isSender = data.some(conn => conn.sender_id === userId && conn.status === 'pending');
    
    return { isConnected, isPending, isSender };
  }
};

// Pour rétrocompatibilité - même interface que l'ancien friendRequestsAdapter
export const friendRequestsAdapter = {
  // Chercher les demandes acceptées
  async findAcceptedConnections(userId: string) {
    return connectionAdapter.findAcceptedConnections(userId);
  },

  // Chercher les demandes en attente
  async findPendingRequests(userId: string) {
    return connectionAdapter.findPendingRequests(userId);
  },

  // Créer une demande d'ami
  async createFriendRequest(senderId: string, receiverId: string) {
    return connectionAdapter.createConnectionRequest(senderId, receiverId);
  },

  // Accepter une demande d'ami
  async acceptFriendRequest(requestId: string) {
    return connectionAdapter.acceptConnectionRequest(requestId);
  },

  // Rejeter/Supprimer une demande d'ami
  async deleteFriendRequest(requestId: string) {
    return connectionAdapter.deleteConnectionRequest(requestId);
  },

  // Vérifier si les utilisateurs sont amis
  async checkFriendStatus(userId: string, profileId: string) {
    const { isConnected, isPending, isSender } = await connectionAdapter.checkConnectionStatus(userId, profileId);
    return { isFriend: isConnected, isPending, isSender };
  }
};
