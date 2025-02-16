import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceListing, MarketplaceOffer } from "@/types/marketplace";
import { toast } from "sonner";

type ListingResponse = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  type: 'vente' | 'location' | 'service';
  status: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  images: string[];
  seller: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function useMarketplace() {
  const queryClient = useQueryClient();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          id,
          title,
          description,
          price,
          currency,
          type,
          status,
          seller_id,
          created_at,
          updated_at,
          images,
          seller:profiles(full_name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // First cast to unknown, then to our expected type
      const typedData = (data as unknown as ListingResponse[]);

      // Transform the data to match our MarketplaceListing type
      return typedData.map(listing => ({
        ...listing,
        seller: listing.seller || undefined
      }));
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
