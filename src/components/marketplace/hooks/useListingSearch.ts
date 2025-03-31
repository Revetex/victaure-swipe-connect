
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceFilters } from '@/types/marketplace';
import { PostgrestError } from '@supabase/supabase-js';

interface UseListingSearchProps {
  initialFilters?: MarketplaceFilters;
}

interface UseListingSearchResult {
  listings: any[];
  isLoading: boolean;
  error: PostgrestError | null;
  filters: MarketplaceFilters;
  setFilters: (filters: MarketplaceFilters) => void;
  refresh: () => Promise<void>;
  totalPages?: number; // Add totalPages
  loading?: boolean;  // Add loading for backward compatibility
}

export function useListingSearch({ initialFilters = {} }: UseListingSearchProps = {}): UseListingSearchResult {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1); // Add totalPages state
  const [filters, setFilters] = useState<MarketplaceFilters>({
    search: '',
    category: '',
    location: '',
    min_price: null,
    max_price: null,
    sort_by: 'created_at',
    sort_order: 'desc',
    ...initialFilters
  });

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    let query = supabase
      .from('marketplace_listings')
      .select(`
        *,
        profiles:user_id (id, full_name, avatar_url)
      `);

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }

    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }

    // Use type assertion to avoid deep type instantiation issue
    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = { ascending: filters.sort_order === 'asc' };
    
    // Using type assertion to avoid TS2589 error
    query = query.order(sortBy as string, sortOrder);

    const { data, error, count } = await query;

    if (error) {
      setError(error);
    } else {
      setListings(data || []);
      
      // Calculate totalPages based on count (if paginated query)
      if (count) {
        setTotalPages(Math.ceil(count / 10)); // Assuming 10 items per page
      }
    }

    setIsLoading(false);
  }, [filters]);

  const refresh = useCallback(() => {
    return fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    // Add these properties for backward compatibility
    loading: isLoading,
    totalPages
  };
}
