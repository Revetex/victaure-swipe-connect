import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gig, GigBid } from "@/types/marketplace";
import { toast } from "sonner";

type GigResponse = {
  id: string;
  title: string;
  description: string | null;
  budget: number | null;
  location: string | null;
  duration: string | null;
  required_skills: string[];
  status: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  creator: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function useGigs() {
  const queryClient = useQueryClient();

  const { data: gigs, isLoading } = useQuery({
    queryKey: ['gigs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gigs')
        .select(`
          *,
          creator:profiles!gigs_creator_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as GigResponse[]).map(gig => ({
        ...gig,
        creator: gig.creator || undefined
      })) as Gig[];
    }
  });

  const createGig = useMutation({
    mutationFn: async (gigData: Omit<Gig, 'id' | 'created_at' | 'updated_at' | 'creator'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour créer une jobine");

      const { data, error } = await supabase
        .from('gigs')
        .insert({
          ...gigData,
          creator_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
      toast.success("Votre jobine a été publiée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Une erreur est survenue lors de la publication de la jobine");
    }
  });

  const createBid = useMutation({
    mutationFn: async ({ gig_id, amount, proposal }: { gig_id: string; amount: number; proposal?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour faire une offre");

      const { data, error } = await supabase
        .from('gig_bids')
        .insert({
          gig_id,
          bidder_id: user.id,
          amount,
          proposal
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
      toast.success("Votre offre a été placée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Une erreur est survenue lors du placement de l'offre");
    }
  });

  return {
    gigs,
    isLoading,
    createGig,
    createBid
  };
}
