
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Friend, createEmptyProfile, transformConnection } from "@/types/profile";

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
        const { data: connections, error: connectionsError } = await supabase
          .from('user_connections_view')
          .select('*')
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (connectionsError) {
          console.error("Error loading connections:", connectionsError);
        }

        // Convert connections to Friend objects
        const friends: Friend[] = (connections || []).map(conn => 
          transformConnection(conn, user.id)
        );

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

        const baseProfile = createEmptyProfile(user.id, profileData.email);
        const fullProfile: UserProfile = {
          ...baseProfile,
          ...profileData,
          role: (profileData.role || 'professional') as "professional" | "business" | "admin",
          friends,
          certifications: certificationsResponse.data || [],
          education: educationResponse.data || [],
          experiences: experiencesResponse.data || [],
          // Assurer que online_status est un boolean
          online_status: typeof profileData.online_status === 'string' 
            ? (profileData.online_status === 'online' || profileData.online_status === 'true')
            : !!profileData.online_status
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
