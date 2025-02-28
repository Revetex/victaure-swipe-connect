
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MarketplaceFilters, MarketplaceListing } from '@/types/marketplace';
import { toast } from 'sonner';
import { adaptListingData } from '@/utils/marketplace';
import { cacheManager } from '@/utils/cacheManager';
import { handleError } from '@/utils/errorHandler';

/**
 * Hook pour rechercher et filtrer les annonces du marketplace
 * @param searchQuery Terme de recherche
 * @param filters Filtres à appliquer
 * @param type Type d'annonce à afficher
 * @param page Page actuelle
 * @param itemsPerPage Nombre d'éléments par page
 */
export function useListingSearch(
  searchQuery: string,
  filters: MarketplaceFilters,
  type: 'all' | 'vente' | 'location' | 'service',
  page: number = 1,
  itemsPerPage: number = 12
) {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fonction de récupération des annonces
  const fetchListings = useCallback(async () => {
    // Génère une clé de cache unique basée sur les paramètres de recherche
    const cacheKey = `listings:${type}:${searchQuery}:${JSON.stringify(filters)}:${page}:${itemsPerPage}`;
    
    try {
      setLoading(true);
      
      // Tente d'abord de récupérer depuis le cache
      const cachedData = await cacheManager.get(
        cacheKey,
        async () => {
          const from = (page - 1) * itemsPerPage;
          const to = from + itemsPerPage - 1;

          // Construction de la requête de base
          let query = supabase
            .from('marketplace_listings')
            .select(`
              *,
              seller:profiles(id, full_name, avatar_url, rating)
            `, { count: 'exact' })
            .eq('status', 'active');

          // Application du filtre par type
          if (type !== 'all') {
            query = query.eq('type', type);
          }

          // Application de la recherche textuelle
          if (searchQuery) {
            query = query.ilike('title', `%${searchQuery}%`);
          }

          // Application du filtre de prix
          if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
            query = query
              .gte('price', filters.priceRange[0])
              .lte('price', filters.priceRange[1]);
          }

          // Application du filtre par catégorie
          if (filters.categories?.length) {
            query = query.in('category', filters.categories);
          }

          // Application du filtre par localisation
          if (filters.location) {
            query = query.ilike('location', `%${filters.location}%`);
          }

          // Application du tri
          const { sortBy, sortOrder } = filters;
          switch (sortBy) {
            case 'date':
              query = query.order('created_at', { ascending: sortOrder === 'asc' });
              break;
            case 'price':
              query = query.order('price', { ascending: sortOrder === 'asc' });
              break;
            case 'rating':
              // Tri par évaluation nécessiterait une logique plus complexe
              query = query.order('created_at', { ascending: false });
              break;
            case 'views':
              query = query.order('views_count', { ascending: sortOrder === 'asc' });
              break;
            default:
              query = query.order('created_at', { ascending: false });
          }

          // Application de la pagination
          query = query.range(from, to);

          // Récupère également les favoris de l'utilisateur
          const userSession = await supabase.auth.getSession();
          const userId = userSession.data.session?.user.id;
          
          let favorites: Record<string, boolean> = {};
          
          if (userId) {
            const { data: favoritesData } = await supabase
              .from('marketplace_favorites')
              .select('item_id')
              .eq('user_id', userId);
              
            if (favoritesData) {
              favorites = favoritesData.reduce((acc, fav) => {
                acc[fav.item_id] = true;
                return acc;
              }, {} as Record<string, boolean>);
            }
          }

          // Exécution de la requête principale
          const { data, error: queryError, count } = await query;

          if (queryError) throw queryError;

          // Transforme les données et ajoute l'information de favoris
          const formattedListings = data ? data.map(item => {
            const listing = adaptListingData(item);
            // Ajoute l'état de favori à chaque annonce
            return {
              ...listing,
              isFavorite: favorites[listing.id] || false
            };
          }) : [];
          
          return {
            listings: formattedListings,
            count: count || 0
          };
        },
        // 5 minutes de TTL pour le cache
        5 * 60 * 1000
      );

      setListings(cachedData.listings);
      setTotalCount(cachedData.count);
      setTotalPages(Math.ceil(cachedData.count / itemsPerPage));
      
    } catch (err) {
      const handledError = handleError(err, false);
      setError(new Error(handledError.message));
      toast.error("Erreur lors du chargement des annonces", {
        description: handledError.suggestion
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, type, page, itemsPerPage]);

  // Récupérer les annonces lorsque les dépendances changent
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Fonction pour rafraîchir manuellement les données
  const refresh = useCallback(() => {
    // Invalide le cache pour cette requête
    const cacheKey = `listings:${type}:${searchQuery}:${JSON.stringify(filters)}:${page}:${itemsPerPage}`;
    cacheManager.invalidate(cacheKey);
    fetchListings();
  }, [fetchListings, type, searchQuery, filters, page, itemsPerPage]);

  // Fonction pour marquer/démarquer une annonce comme favori
  const toggleFavorite = useCallback(async (listingId: string) => {
    const userSession = await supabase.auth.getSession();
    const userId = userSession.data.session?.user.id;
    
    if (!userId) {
      toast.error("Vous devez être connecté pour ajouter aux favoris");
      return;
    }
    
    // Trouve l'annonce et vérifie son état actuel
    const listing = listings.find(item => item.id === listingId);
    if (!listing) return;
    
    try {
      // Mise à jour optimiste de l'interface
      setListings(prev => prev.map(item => 
        item.id === listingId 
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      ));
      
      if (listing.isFavorite) {
        // Supprime des favoris
        await supabase
          .from('marketplace_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('item_id', listingId);
          
        toast.success("Retiré des favoris");
      } else {
        // Ajoute aux favoris
        await supabase
          .from('marketplace_favorites')
          .insert({
            user_id: userId,
            item_id: listingId
          });
          
        toast.success("Ajouté aux favoris");
      }
      
      // Invalide le cache pour rafraîchir les données
      cacheManager.invalidateByPrefix('listings:');
      
    } catch (err) {
      // En cas d'erreur, on revient à l'état précédent
      handleError(err);
      setListings(prev => prev.map(item => 
        item.id === listingId 
          ? { ...item, isFavorite: listing.isFavorite }
          : item
      ));
    }
  }, [listings]);

  return { 
    listings, 
    loading, 
    error, 
    totalCount, 
    totalPages,
    refresh,
    toggleFavorite
  };
}
