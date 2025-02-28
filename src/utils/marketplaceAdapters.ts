
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Vérifie si un élément est dans les favoris
 */
export function checkIsFavorited(favorites: any[], itemId: string): boolean {
  // Vérifie les deux propriétés possibles
  return favorites?.some(fav => 
    (fav.item_id === itemId) || (fav.listing_id === itemId)
  ) || false;
}

/**
 * Récupère les favoris d'un utilisateur
 */
export async function getFavorites(userId: string) {
  try {
    // Utiliser une assertion de type pour éviter les problèmes de profondeur de type
    const { data, error } = await supabase
      .from('marketplace_favorites')
      .select('*')
      .eq('user_id', userId) as any;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

/**
 * Bascule le statut favori d'un élément
 */
export async function toggleFavorite(params: {
  itemId: string;
  userId: string;
  isFavorited: boolean;
}) {
  const { itemId, userId, isFavorited } = params;
  
  try {
    if (isFavorited) {
      // Supprimer des favoris
      await supabase
        .from('marketplace_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('item_id', itemId);
      
      toast.success("Retiré des favoris");
      return false;
    } else {
      // Ajouter aux favoris
      await supabase
        .from('marketplace_favorites')
        .insert({
          item_id: itemId,
          user_id: userId
        });
      
      toast.success("Ajouté aux favoris");
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    toast.error("Une erreur est survenue");
    return isFavorited;
  }
}

/**
 * Adaptateur pour handleFavoriteToggle qui gère les différents formats de paramètres
 */
export function adaptHandleFavoriteToggle(params: any) {
  // Extraire les valeurs correctes quel que soit le format
  const itemId = params.item_id || params.listing_id;
  const userId = params.user_id || params.viewer_id;
  
  return async function(isFavorited: boolean) {
    return await toggleFavorite({
      itemId,
      userId,
      isFavorited
    });
  };
}
