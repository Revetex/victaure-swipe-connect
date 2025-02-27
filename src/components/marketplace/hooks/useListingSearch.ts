
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MarketplaceFilters, MarketplaceListing } from '@/types/marketplace';
import { toast } from 'sonner';

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

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        let query = supabase
          .from('marketplace_listings')
          .select(`
            *,
            seller:profiles(full_name, avatar_url, rating)
          `, { count: 'exact' })
          .eq('status', 'active');

        // Apply type filter
        if (type !== 'all') {
          query = query.eq('type', type);
        }

        // Apply text search filter
        if (searchQuery) {
          try {
            query = query.ilike('title', `%${searchQuery}%`);
          } catch (error) {
            console.error("Error with text search, using ILIKE as fallback:", error);
            query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
          }
        }

        // Apply price range filter
        if (filters.priceRange) {
          query = query
            .gte('price', filters.priceRange[0])
            .lte('price', filters.priceRange[1]);
        }

        // Apply category filter
        if (filters.categories && filters.categories.length > 0) {
          query = query.in('category', filters.categories);
        }

        // Apply location filter
        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }

        // Apply sorting
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
            break;
        }

        // Apply pagination
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;
        
        if (data) {
          const formattedListings: MarketplaceListing[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            currency: item.currency,
            type: item.type,
            status: item.status,
            seller_id: item.seller_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            images: item.images || [],
            location: item.location || undefined,
            category: item.category || undefined,
            views_count: item.views_count || 0,
            favorites_count: item.favorites_count || 0,
            featured: item.featured || false,
            sale_type: item.sale_type || undefined,
            seller: item.seller ? {
              full_name: item.seller.full_name,
              avatar_url: item.seller.avatar_url,
              rating: item.seller.rating
            } : undefined
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
