
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

        // Convertir les données correctement pour le type Gig
        if (data) {
          const formattedGigs: Gig[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
            budget: item.budget,
            creator_id: item.creator_id,
            location: item.location,
            duration: item.duration,
            required_skills: item.required_skills,
            creator: item.creator,
            // Ces propriétés peuvent être undefined
            price: undefined,
            delivery_time: undefined,
            provider_id: undefined
          }));
          setGigs(formattedGigs);
        }
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
