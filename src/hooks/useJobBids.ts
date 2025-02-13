
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JobBid {
  id: string;
  job_id: string;
  bidder_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  message: string | null;
  created_at: string | null;
  updated_at: string | null;
  bidder?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useJobBids(jobId: string) {
  const { data: bids, isLoading, error } = useQuery({
    queryKey: ['job-bids', jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_bids')
        .select(`
          *,
          bidder:profiles(full_name, avatar_url)
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as JobBid[];
    }
  });

  const placeBid = async (amount: number, message?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour faire une offre");
        return;
      }

      const { error } = await supabase
        .from('job_bids')
        .insert({
          job_id: jobId,
          bidder_id: user.id,
          amount,
          message,
          currency: 'CAD'
        });

      if (error) throw error;
      
      toast.success("Votre offre a été envoyée avec succès");
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error("Une erreur est survenue lors de l'envoi de votre offre");
    }
  };

  return {
    bids,
    isLoading,
    error,
    placeBid
  };
}
