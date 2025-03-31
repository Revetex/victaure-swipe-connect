
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SearchFilters } from '@/types/marketplace';
import { PostgrestError } from '@supabase/supabase-js';

interface UseListingSearchProps {
  initialFilters?: SearchFilters;
}

interface UseListingSearchResult {
  listings: any[];
  isLoading: boolean;
  error: PostgrestError | null;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  refresh: () => Promise<void>;
}

export function useListingSearch({ initialFilters = {} }: UseListingSearchProps = {}): UseListingSearchResult {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
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

    // Simple fix to avoid deep type instantiation
    const sortBy = filters.sort_by || 'created_at';
    query = query.order(sortBy, { ascending: filters.sort_order === 'asc' });

    const { data, error } = await query;

    if (error) {
      setError(error);
    } else {
      setListings(data || []);
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
    refresh
  };
}
