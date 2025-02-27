
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceFilters, MarketplaceListing } from '@/types/marketplace';
import { toast } from 'sonner';

export interface ExtendedListing extends MarketplaceListing {
  location?: string;
  category?: string;
  views_count?: number;
  favorites_count?: number;
  featured?: boolean;
  sale_type?: string;
}

/**
 * Version adaptée de useListingSearch qui résout les problèmes de type
 */
export function useListingSearchAdapter(
  searchQuery: string,
  filters: MarketplaceFilters,
  type: 'all' | 'vente' | 'location' | 'service',
  page: number = 1,
  itemsPerPage: number = 12
) {
  const [listings, setListings] = useState<ExtendedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        // Utiliser l'opérateur as pour éviter les problèmes d'instanciation de type profonde
        let query = supabase
          .from('marketplace_listings')
          .select(`
            *,
            seller:profiles(id, full_name, avatar_url, rating)
          `, { count: 'exact' }) as any;

        query = query.eq('status', 'active');

        // Appliquer le filtre de type
        if (type !== 'all') {
          query = query.eq('type', type);
        }

        // Appliquer la recherche et les autres filtres
        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }

        if (filters.priceRange) {
          query = query
            .gte('price', filters.priceRange[0])
            .lte('price', filters.priceRange[1]);
        }

        if (filters.categories?.length) {
          query = query.in('category', filters.categories);
        }

        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }

        // Appliquer le tri
        const { sortBy, sortOrder } = filters;
        switch (sortBy) {
          case 'date':
            query = query.order('created_at', { ascending: sortOrder === 'asc' });
            break;
          case 'price':
            query = query.order('price', { ascending: sortOrder === 'asc' });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        // Appliquer la pagination
        query = query.range(from, to);

        const { data, error: queryError, count } = await query;

        if (queryError) throw queryError;

        if (data) {
          // Transformer les données pour correspondre à ExtendedListing
          const formattedListings: ExtendedListing[] = data.map((item: any) => ({
            id: item.id,
            title: item.title || '',
            description: item.description || '',
            price: item.price || 0,
            currency: item.currency || 'CAD',
            type: item.type || 'vente',
            status: item.status || 'active',
            seller_id: item.seller_id || '',
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString(),
            images: item.images || [],
            seller: item.seller ? {
              id: item.seller.id,
              full_name: item.seller.full_name || '',
              avatar_url: item.seller.avatar_url || null,
              rating: item.seller.rating
            } : undefined,
            location: item.location || '',
            category: item.category || '',
            views_count: item.views_count || 0,
            favorites_count: item.favorites_count || 0,
            featured: Boolean(item.featured),
            sale_type: item.sale_type || ''
          }));
          
          setListings(formattedListings);
          
          if (count !== null) {
            setTotalCount(count);
            setTotalPages(Math.ceil(count / itemsPerPage));
          }
        }

      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        toast.error("Erreur lors du chargement des annonces");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchQuery, filters, type, page, itemsPerPage]);

  return { listings, loading, error, totalCount, totalPages };
}
