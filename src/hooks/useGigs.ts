
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Gig } from '@/types/marketplace';

export function useGigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('gigs')
          .select(`
            *,
            creator:profiles(id, full_name, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        // Convertir les données pour qu'elles correspondent au type Gig
        const formattedGigs: Gig[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          delivery_time: item.delivery_time,
          provider_id: item.provider_id || item.creator_id,
          status: item.status,
          created_at: item.created_at,
          budget: item.budget,
          creator: item.creator,
          required_skills: item.required_skills,
          location: item.location,
          duration: item.duration,
          creator_id: item.creator_id
        }));

        setGigs(formattedGigs);
      } catch (err) {
        console.error("Error fetching gigs:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  return { gigs, loading, error };
}
