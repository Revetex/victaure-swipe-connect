
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
            location,
            condition,
            sale_type,
            views_count,
            favorites_count,
            featured,
            seller:profiles (
              full_name,
              avatar_url,
              rating
            )
          `, { count: 'exact' })
          .eq('status', 'active');

        // Appliquer le filtre de type d'annonce
        if (type !== 'all') {
          query = query.eq('type', type);
        }

        // Appliquer la recherche textuelle
        if (searchQuery) {
          query = query.textSearch('searchable_text', searchQuery, {
            type: 'websearch',
            config: 'french'
          });
        }

        // Appliquer les filtres de prix
        if (filters.priceRange) {
          query = query
            .gte('price', filters.priceRange[0])
            .lte('price', filters.priceRange[1]);
        }

        // Appliquer les filtres de catégorie
        if (filters.categories && filters.categories.length > 0) {
          query = query.in('category', filters.categories);
        }

        // Appliquer les filtres de localisation
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
          case 'rating':
            // Tri indirect par la note du vendeur
            query = query.order('seller(rating)', { ascending: sortOrder === 'asc' });
            break;
          case 'views':
            query = query.order('views_count', { ascending: sortOrder === 'asc' });
            break;
        }

        // Ajouter la pagination
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;
        
        if (data) {
          setListings(data as MarketplaceListing[]);
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
