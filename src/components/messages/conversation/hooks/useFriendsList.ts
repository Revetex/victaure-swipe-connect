
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Receiver } from '@/types/messages';

export function useFriendsList() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Receiver[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const loadFriends = async () => {
      try {
        setLoading(true);
        // Obtenir les amis depuis la table friendships
        const { data: friendshipsData, error: friendshipsError } = await supabase
          .from('friendships')
          .select(`
            friend_id,
            friend:profiles!friendships_friend_id_fkey(
              id,
              full_name,
              avatar_url,
              email,
              role,
              bio,
              phone,
              city,
              state,
              country,
              skills,
              latitude,
              longitude,
              online_status,
              last_seen,
              certifications (
                *
              ),
              education (
                *
              ),
              experiences (
                *
              )
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'accepted');

        if (friendshipsError) throw friendshipsError;

        if (friendshipsData) {
          const formattedFriends = friendshipsData.map(friendship => ({
            id: friendship.friend.id,
            full_name: friendship.friend.full_name || '',
            avatar_url: friendship.friend.avatar_url,
            email: friendship.friend.email,
            role: friendship.friend.role as 'professional' | 'business' | 'admin',
            bio: friendship.friend.bio,
            phone: friendship.friend.phone,
            city: friendship.friend.city,
            state: friendship.friend.state,
            country: friendship.friend.country,
            skills: friendship.friend.skills || [],
            latitude: friendship.friend.latitude,
            longitude: friendship.friend.longitude,
            online_status: friendship.friend.online_status ? 'online' : 'offline',
            last_seen: friendship.friend.last_seen,
            certifications: friendship.friend.certifications || [],
            education: friendship.friend.education || [],
            experiences: friendship.friend.experiences || [],
            friends: []
          }));

          setFriends(formattedFriends);
        }
      } catch (error) {
        console.error('Error loading friends:', error);
        toast.error('Impossible de charger la liste d\'amis');
      } finally {
        setLoading(false);
      }
    };

    loadFriends();

    // Mettre en place l'écoute des changements en temps réel
    const friendsChannel = supabase.channel('friends-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadFriends(); // Recharger la liste quand il y a des changements
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(friendsChannel);
    };
  }, [user?.id]);

  return { friends, loading };
}
