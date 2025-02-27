
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MarketplaceFilters, MarketplaceListing } from '@/types/marketplace';
import { toast } from 'sonner';
import { adaptListingData } from '@/utils/marketplace';

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
            seller:profiles(id, full_name, avatar_url, rating)
          `, { count: 'exact' })
          .eq('status', 'active');

        // Apply type filter
        if (type !== 'all') {
          query = query.eq('type', type);
        }

        // Apply search and other filters
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
        }

        // Apply pagination
        query = query.range(from, to);

        const { data, error: queryError, count } = await query;

        if (queryError) throw queryError;

        if (data) {
          // Utiliser l'adaptateur pour transformer les données
          const formattedListings = data.map(adaptListingData);
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
