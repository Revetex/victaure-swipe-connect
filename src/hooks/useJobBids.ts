
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useJobBids(jobId: string) {
  const [bids, setBids] = useState<any[]>([]);

  const placeBid = async (amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour placer une enchère");
        return;
      }

      const { data, error } = await supabase
        .from('job_bids')
        .insert([
          {
            job_id: jobId,
            bidder_id: user.id,
            amount: amount,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Votre enchère a été placée avec succès !");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue lors du placement de l'enchère");
      console.error('Error placing bid:', error);
    }
  };

  return {
    bids,
    placeBid,
  };
}
