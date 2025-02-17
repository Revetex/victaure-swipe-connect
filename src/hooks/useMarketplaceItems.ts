
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTypes } from "@/types/database/payments";
import { toast } from "sonner";

type MarketplaceItem = PaymentTypes['Tables']['marketplace_items']['Row'];

type ItemWithSeller = MarketplaceItem & {
  seller: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  external_source?: string;
  external_id?: string;
  external_url?: string;
  external_data?: any;
};

export function useMarketplaceItems() {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery<ItemWithSeller[]>({
    queryKey: ['marketplace-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          seller:profiles(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ItemWithSeller[];
    }
  });

  const createItem = useMutation({
    mutationFn: async (item: Omit<MarketplaceItem, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'favorites_count'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour créer une annonce");

      const { data, error } = await supabase
        .from('marketplace_items')
        .insert({
          ...item,
          seller_id: user.id,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-items'] });
      toast.success("Votre annonce a été créée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Une erreur est survenue lors de la création de l'annonce");
    }
  });

  const search = useMutation({
    mutationFn: async (query: string) => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          seller:profiles(full_name, avatar_url)
        `)
        .textSearch('searchable_text', query)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ItemWithSeller[];
    }
  });

  return {
    items,
    isLoading,
    createItem,
    search
  };
}
