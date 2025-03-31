
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
  totalPages: number;
  loading: boolean; // Add loading for backward compatibility
}

interface ExtendedFilters extends MarketplaceFilters {
  search?: string;
  location?: string;
  min_price?: number | null;
  max_price?: number | null;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export function useListingSearch({ initialFilters = {} as MarketplaceFilters }: UseListingSearchProps = {}): UseListingSearchResult {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Initialize with default values for the required properties
  const defaultFilters: MarketplaceFilters = {
    priceRange: [0, 10000],
    sortBy: 'date',
    sortOrder: 'desc',
    ...initialFilters
  };
  
  const [filters, setFilters] = useState<MarketplaceFilters>(defaultFilters);
  
  // Create extended filters for internal use
  const getExtendedFilters = (): ExtendedFilters => {
    const extendedFilters: ExtendedFilters = {
      ...filters,
      // Map the MarketplaceFilters properties to the properties used in the query
      min_price: filters.priceRange?.[0] || null,
      max_price: filters.priceRange?.[1] || null,
      sort_by: filters.sortBy === 'date' ? 'created_at' : filters.sortBy,
      sort_order: filters.sortOrder
    };
    
    // Add search from categories if available
    if (filters.categories && filters.categories.length > 0) {
      extendedFilters.search = filters.categories.join(' ');
    }
    
    return extendedFilters;
  };

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const extendedFilters = getExtendedFilters();

      // First build the basic query without any chaining to avoid excessive type instantiation
      const baseQuery = supabase
        .from('marketplace_listings')
        .select('*, profiles:user_id (id, full_name, avatar_url)', { count: 'exact' });
      
      // Then apply filters one by one using type assertions to avoid circular type references
      let filteredQuery: any = baseQuery;
      
      // Apply text search
      if (extendedFilters.search) {
        filteredQuery = filteredQuery.ilike('title', `%${extendedFilters.search}%`);
      }
      
      // Apply category filters
      if (extendedFilters.categories && extendedFilters.categories.length > 0 && extendedFilters.categories[0] !== '') {
        filteredQuery = filteredQuery.in('category', extendedFilters.categories);
      }
      
      // Apply location filter
      if (extendedFilters.location) {
        filteredQuery = filteredQuery.ilike('location', `%${extendedFilters.location}%`);
      }
      
      // Apply price range filters
      if (extendedFilters.min_price !== null && extendedFilters.min_price !== undefined) {
        filteredQuery = filteredQuery.gte('price', extendedFilters.min_price);
      }
      
      if (extendedFilters.max_price !== null && extendedFilters.max_price !== undefined) {
        filteredQuery = filteredQuery.lte('price', extendedFilters.max_price);
      }
      
      // Apply sorting
      const sortBy = extendedFilters.sort_by || 'created_at';
      const sortOrder = { ascending: extendedFilters.sort_order === 'asc' };
      
      // Execute the query with ordering as the final step
      const { data, error: queryError, count } = await filteredQuery.order(sortBy, sortOrder);
      
      if (queryError) {
        setError(queryError);
      } else {
        setListings(data || []);
        
        // Calculate totalPages based on count
        if (count !== null) {
          setTotalPages(Math.ceil(count / 10)); // Assuming 10 items per page
        }
      }
    } catch (err) {
      console.error('Error in fetch listings:', err);
      if (err instanceof Error) {
        setError({ message: err.message } as PostgrestError);
      }
    } finally {
      setIsLoading(false);
    }
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
