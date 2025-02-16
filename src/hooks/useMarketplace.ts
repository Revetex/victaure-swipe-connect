
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceListing, MarketplaceOffer } from "@/types/marketplace";
import { toast } from "sonner";

export function useMarketplace() {
  const queryClient = useQueryClient();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      const { data: listings, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          seller:profiles!marketplace_listings_seller_id_fkey(full_name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return listings as MarketplaceListing[];
    }
  });

  const createListing = useMutation({
    mutationFn: async (listingData: Omit<MarketplaceListing, 'id' | 'created_at' | 'updated_at' | 'seller'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour créer une annonce");

      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert({
          ...listingData,
          seller_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast.success("Votre annonce a été publiée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Une erreur est survenue lors de la publication de l'annonce");
    }
  });

  const createOffer = useMutation({
    mutationFn: async ({ listing_id, amount }: { listing_id: string; amount: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour faire une offre");

      const { data, error } = await supabase
        .from('marketplace_offers')
        .insert({
          listing_id,
          bidder_id: user.id,
          amount
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast.success("Votre offre a été placée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Une erreur est survenue lors du placement de l'offre");
    }
  });

  return {
    listings,
    isLoading,
    createListing,
    createOffer
  };
}
