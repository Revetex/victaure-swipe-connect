
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MarketplaceListing, MarketplaceOffer } from '@/types/marketplace';

export function useMarketplace() {
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          seller:seller_id(
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MarketplaceListing[];
    },
  });

  const createListingMutation = useMutation({
    mutationFn: async (listingData: Partial<MarketplaceListing>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert({
          ...listingData,
          seller_id: user.user.id,
          status: 'active',
          title: listingData.title || 'New Listing',
          price: listingData.price || 0,
          type: listingData.type || 'vente'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Listing created successfully');
    },
    onError: (error) => {
      toast.error('Error creating listing');
      console.error('Error:', error);
    }
  });

  return {
    listings,
    isLoading,
    createListing: createListingMutation.mutate
  };
}
