
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
  category?: string;
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
    
    const extendedFilters = getExtendedFilters();

    // Create a base query that we'll modify with filters
    let query = supabase
      .from('marketplace_listings')
      .select(`
        *,
        profiles:user_id (id, full_name, avatar_url)
      `);

    // Apply filters
    if (extendedFilters.search) {
      query = query.ilike('title', `%${extendedFilters.search}%`);
    }

    // Categories filtering
    if (extendedFilters.categories && extendedFilters.categories.length > 0 && extendedFilters.categories[0] !== '') {
      query = query.in('category', extendedFilters.categories);
    }

    // Location filtering
    if (extendedFilters.location) {
      query = query.ilike('location', `%${extendedFilters.location}%`);
    }

    // Price range filtering
    if (extendedFilters.min_price !== null && extendedFilters.min_price !== undefined) {
      query = query.gte('price', extendedFilters.min_price);
    }

    if (extendedFilters.max_price !== null && extendedFilters.max_price !== undefined) {
      query = query.lte('price', extendedFilters.max_price);
    }

    // Sorting
    const sortBy = extendedFilters.sort_by || 'created_at';
    const sortOrder = { ascending: extendedFilters.sort_order === 'asc' };
    
    // Fix: Type the query properly to avoid excessive type instantiation
    const finalQuery = query.order(sortBy, sortOrder);

    try {
      const { data, error: queryError, count } = await finalQuery;

      if (queryError) {
        setError(queryError);
      } else {
        setListings(data || []);
        
        // Calculate totalPages based on count (if paginated query)
        if (count) {
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
