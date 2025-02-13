
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTypes } from "@/types/database/payments";
import { toast } from "sonner";

export function useMarketplaceItems() {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['marketplace-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          seller:profiles(
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createItem = useMutation({
    mutationFn: async (item: PaymentTypes['Tables']['marketplace_items']['Insert']) => {
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
      toast.success("Votre article a été publié avec succès");
    },
    onError: (error) => {
      console.error('Error creating item:', error);
      toast.error("Une erreur est survenue lors de la création de l'annonce");
    }
  });

  return {
    items,
    isLoading,
    createItem
  };
}
