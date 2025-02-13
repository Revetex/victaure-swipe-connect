
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTypes } from "@/types/database/payments";
import { toast } from "sonner";

type MarketplaceService = PaymentTypes['Tables']['marketplace_services']['Row'];
type ServiceBid = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  bidder: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

type ServiceWithDetails = MarketplaceService & {
  provider: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  bids: ServiceBid[];
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
          provider:profiles(full_name, avatar_url),
          bids:service_bids(
            id,
            amount,
            status,
            created_at,
            bidder:profiles(full_name, avatar_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ServiceWithDetails[];
    }
  });

  const createBid = useMutation({
    mutationFn: async (bid: { service_id: string; amount: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour faire une enchère");

      const { data, error } = await supabase
        .from('service_bids')
        .insert({
          service_id: bid.service_id,
          bidder_id: user.id,
          amount: bid.amount,
          status: 'pending'
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
