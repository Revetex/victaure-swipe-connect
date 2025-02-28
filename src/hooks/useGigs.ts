
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Gig } from '@/types/marketplace';

export function useGigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const { data, error } = await supabase
          .from('gigs')
          .select(`
            *,
            creator:profiles(id, full_name, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setGigs(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  // Retourner les deux propriétés pour être compatible avec les deux styles d'appel
  return { gigs, loading, isLoading: loading, error };
}
