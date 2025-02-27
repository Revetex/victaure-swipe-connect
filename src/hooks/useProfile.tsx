
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Friend, createEmptyProfile, transformDatabaseProfile, transformEducation, transformCertification, transformExperience } from "@/types/profile";

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

        // Get friend connections where status is accepted
        const { data: connections } = await supabase
          .from('user_connections')
          .select(`
            id,
            sender_id,
            receiver_id,
            status,
            sender:profiles!sender_id(
              id,
              full_name,
              avatar_url,
              online_status,
              last_seen
            ),
            receiver:profiles!receiver_id(
              id,
              full_name,
              avatar_url,
              online_status,
              last_seen
            )
          `)
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        // Parallel queries for other data
        const [certificationsResponse, educationResponse, experiencesResponse] = 
          await Promise.all([
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

        // Transform connections into Friend objects
        const friends: Friend[] = (connections || []).map(conn => {
          const isSender = conn.sender_id === user.id;
          const friendData = isSender ? conn.receiver : conn.sender;
          
          return {
            id: friendData.id,
            full_name: friendData.full_name,
            avatar_url: friendData.avatar_url,
            online_status: friendData.online_status || false,
            last_seen: friendData.last_seen,
            role: 'professional',
            bio: null,
            phone: null,
            city: null,
            state: null,
            country: null,
            skills: [],
            friendship_id: conn.id,
            status: 'accepted'
          };
        });

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
