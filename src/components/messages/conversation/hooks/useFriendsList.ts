
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Receiver } from "@/types/messages";

interface FriendshipData {
  friend: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    online_status: boolean;
    email: string | null;
    role: 'professional' | 'business' | 'admin';
    bio: string | null;
    phone: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    skills: string[];
  }
}

export function useFriendsList() {
  const [friends, setFriends] = useState<Receiver[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const loadFriends = async () => {
    try {
      setLoadingFriends(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: friendships, error } = await supabase
        .from('friendships')
        .select(`
          friend:profiles!friendships_friend_id_fkey (
            id,
            full_name,
            avatar_url,
            online_status,
            email,
            role,
            bio,
            phone,
            city,
            state,
            country,
            skills
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      if (friendships) {
        const formattedFriends: Receiver[] = (friendships as unknown as FriendshipData[])
          .map(friendship => ({
            ...friendship.friend,
            online_status: friendship.friend.online_status ? 'online' as const : 'offline' as const,
            last_seen: new Date().toISOString(),
            certifications: [],
            education: [],
            experiences: [],
            friends: [],
            latitude: null,
            longitude: null,
            avatar_url: friendship.friend.avatar_url || null,
            email: friendship.friend.email || null,
            bio: friendship.friend.bio || null,
            phone: friendship.friend.phone || null,
            city: friendship.friend.city || null,
            state: friendship.friend.state || null,
            country: friendship.friend.country || null,
            skills: friendship.friend.skills || []
          }));

        setFriends(formattedFriends);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
      toast.error("Impossible de charger vos amis");
    } finally {
      setLoadingFriends(false);
    }
  };

  return {
    friends,
    loadingFriends,
    loadFriends
  };
}
