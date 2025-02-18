
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Friend, createEmptyProfile } from "@/types/profile";
import { transformDatabaseProfile, transformEducation, transformCertification, transformExperience } from "@/types/profile";

export function useProfile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("No authenticated user");
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Get friend requests from both perspectives where status is accepted
        const [sentRequests, receivedRequests] = await Promise.all([
          supabase
            .from('friend_requests')
            .select('receiver_id')
            .eq('sender_id', user.id)
            .eq('status', 'accepted'),
          supabase
            .from('friend_requests')
            .select('sender_id')
            .eq('receiver_id', user.id)
            .eq('status', 'accepted')
        ]);

        // Combine friend IDs from both queries
        const friendIds = [
          ...(sentRequests.data?.map(r => r.receiver_id) || []),
          ...(receivedRequests.data?.map(r => r.sender_id) || [])
        ];

        // Remove duplicates
        const uniqueFriendIds = [...new Set(friendIds)];
        
        // Requêtes parallèles pour de meilleures performances
        const [friendsResponse, certificationsResponse, educationResponse, experiencesResponse] = 
          await Promise.all([
            supabase
              .from('profiles')
              .select('id, full_name, avatar_url, online_status, last_seen')
              .in('id', uniqueFriendIds),
            supabase
              .from('certifications')
              .select('*')
              .eq('profile_id', user.id),
            supabase
              .from('education')
              .select('*')
              .eq('profile_id', user.id),
            supabase
              .from('experiences')
              .select('*')
              .eq('profile_id', user.id)
          ]);

        if (!isMounted) return;

        const friends: Friend[] = (friendsResponse.data || []).map(friend => ({
          id: friend.id,
          full_name: friend.full_name,
          avatar_url: friend.avatar_url,
          online_status: friend.online_status,
          last_seen: friend.last_seen
        }));

        const baseProfile = createEmptyProfile(user.id, profileData.email);
        const fullProfile: UserProfile = {
          ...baseProfile,
          ...profileData,
          role: (profileData.role || 'professional') as "professional" | "business" | "admin",
          friends,
          certifications: (certificationsResponse.data || []).map(cert => transformCertification(cert)),
          education: (educationResponse.data || []).map(edu => transformEducation(edu)),
          experiences: (experiencesResponse.data || []).map(exp => transformExperience(exp))
        };

        setProfile(fullProfile);
        setTempProfile(fullProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (isMounted) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger votre profil",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  return { profile, setProfile, tempProfile, setTempProfile, isLoading };
}
