
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Gig, GigBid } from '@/types/marketplace';

export function useGigs() {
  const { data: gigs = [], isLoading } = useQuery({
    queryKey: ['gigs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gigs')
        .select(`
          *,
          creator:creator_id(
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Gig[];
    },
  });

  const createGigMutation = useMutation({
    mutationFn: async (gigData: Partial<Gig>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('gigs')
        .insert({
          ...gigData,
          creator_id: user.user.id,
          status: 'open',
          required_skills: gigData.required_skills || [],
          title: gigData.title || 'New Gig',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Gig created successfully');
    },
    onError: (error) => {
      toast.error('Error creating gig');
      console.error('Error:', error);
    }
  });

  return {
    gigs,
    isLoading,
    createGig: createGigMutation.mutate
  };
}
