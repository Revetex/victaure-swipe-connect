
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTypes } from "@/types/database/payments";
import { toast } from "sonner";

type ServiceWithDetails = PaymentTypes['Tables']['marketplace_services']['Row'] & {
  provider: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  bids: Array<{
    id: string;
    amount: number;
    status: string;
    created_at: string;
    bidder: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }>;
};

export function useServicesData() {
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery<ServiceWithDetails[]>({
    queryKey: ['marketplace-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_services')
        .select(`
          *,
          provider:profiles(
            full_name,
            avatar_url
          ),
          bids:service_bids(
            id,
            amount,
            status,
            created_at,
            bidder:profiles(
              full_name,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createBid = useMutation({
    mutationFn: async (bid: Omit<PaymentTypes['Tables']['service_bids']['Insert'], 'bidder_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour faire une enchère");

      const { data, error } = await supabase
        .from('service_bids')
        .insert({
          ...bid,
          bidder_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-services'] });
      toast.success("Votre enchère a été placée avec succès");
    },
    onError: (error) => {
      console.error('Error placing bid:', error);
      toast.error("Une erreur est survenue lors de l'enchère");
    }
  });

  return {
    services,
    isLoading,
    createBid
  };
}
