
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        if (!isAuthenticated || !user) {
          setProfile(null);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error("Erreur lors du chargement du profil");
          return;
        }

        if (mounted) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [user, isAuthenticated]);

  return { profile, isLoading };
}
