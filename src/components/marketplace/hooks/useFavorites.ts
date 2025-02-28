
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceFavoriteExtended } from '@/types/marketplace';
import { toast } from 'sonner';

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<MarketplaceFavoriteExtended[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('marketplace_favorites')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;

        // Adapter les données pour supporter les deux formats
        const adaptedData = (data || []).map(fav => ({
          ...fav,
          listing_id: fav.item_id,
          viewer_id: fav.user_id
        }));

        setFavorites(adaptedData);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        toast.error("Erreur lors du chargement des favoris");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const toggleFavorite = async (itemId: string) => {
    if (!userId) {
      toast.error("Vous devez être connecté pour gérer les favoris");
      return false;
    }

    try {
      const existingFavorite = favorites.find(f => f.item_id === itemId);

      if (existingFavorite) {
        await supabase
          .from('marketplace_favorites')
          .delete()
          .eq('item_id', itemId)
          .eq('user_id', userId);

        setFavorites(prev => prev.filter(f => f.item_id !== itemId));
        toast.success("Retiré des favoris");
        return false;
      } else {
        const { data, error } = await supabase
          .from('marketplace_favorites')
          .insert({
            item_id: itemId,
            user_id: userId
          })
          .select()
          .single();

        if (error) throw error;

        const newFavorite = {
          ...data,
          listing_id: data.item_id,
          viewer_id: data.user_id
        };

        setFavorites(prev => [...prev, newFavorite]);
        toast.success("Ajouté aux favoris");
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("Une erreur est survenue");
      return false;
    }
  };

  const isFavorited = (itemId: string) => {
    return favorites.some(fav => fav.item_id === itemId || fav.listing_id === itemId);
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorited
  };
}
