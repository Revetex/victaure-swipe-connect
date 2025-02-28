
import { supabase } from "@/integrations/supabase/client";

/**
 * Adaptateur pour les demandes d'amis
 * Il semble que le schéma a changé de friend_requests à user_connections
 */
export const friendRequestsAdapter = {
  // Chercher les demandes acceptées
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
          avatar_url
        ),
        receiver:profiles!user_connections_receiver_id_fkey(
          id,
          full_name,
          avatar_url
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

  // Créer une demande d'ami
  async createFriendRequest(senderId: string, receiverId: string) {
    return supabase
      .from('user_connections')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'pending',
        connection_type: 'friend'
      });
  },

  // Accepter une demande d'ami
  async acceptFriendRequest(requestId: string) {
    return supabase
      .from('user_connections')
      .update({ 
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
  },

  // Rejeter/Supprimer une demande d'ami
  async deleteFriendRequest(requestId: string) {
    return supabase
      .from('user_connections')
      .delete()
      .eq('id', requestId);
  },

  // Vérifier si les utilisateurs sont amis
  async checkFriendStatus(userId: string, profileId: string) {
    const { data: connections } = await supabase
      .from('user_connections')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${userId})`)
      .eq('connection_type', 'friend');
    
    if (!connections || connections.length === 0) return { isFriend: false, isPending: false };
    
    const isPending = connections.some(conn => conn.status === 'pending');
    const isFriend = connections.some(conn => conn.status === 'accepted');
    const isSender = connections.some(conn => conn.sender_id === userId && conn.status === 'pending');
    
    return { isFriend, isPending, isSender };
  }
};
