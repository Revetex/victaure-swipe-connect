
import { supabase } from "@/integrations/supabase/client";

/**
 * Adaptateur pour les connections entre utilisateurs
 */
export const connectionAdapter = {
  // Trouver les connections acceptées
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
        sender:sender_id(
          id,
          full_name,
          avatar_url,
          online_status,
          last_seen
        ),
        receiver:receiver_id(
          id,
          full_name,
          avatar_url,
          online_status,
          last_seen
        )
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted');
  },

  // Trouver les demandes en attente
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
        sender:sender_id(
          id,
          full_name,
          avatar_url
        ),
        receiver:receiver_id(
          id,
          full_name,
          avatar_url
        )
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'pending');
  },

  // Créer une demande de connexion
  async createConnectionRequest(senderId: string, receiverId: string) {
    return supabase
      .from('user_connections')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'pending'
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
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${userId})`);
    
    if (!data || data.length === 0) return { isConnected: false, isPending: false };
    
    const isPending = data.some(conn => conn.status === 'pending');
    const isConnected = data.some(conn => conn.status === 'accepted');
    const isSender = data.some(conn => conn.sender_id === userId && conn.status === 'pending');
    
    return { isConnected, isPending, isSender };
  }
};

// Pour compatibilité avec le code existant
export const friendRequestsAdapter = connectionAdapter;
