
import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { JobFilters } from '@/types/filters';
import { useDebounce } from 'use-debounce';
import { supabase } from '@/integrations/supabase/client';

export function useSearch<T extends Record<string, any>>(
  items: T[],
  searchFields: (keyof T)[],
  filters?: JobFilters
) {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [results, setResults] = useState<T[]>(items);
  const [isSearching, setIsSearching] = useState(false);

  const searchItems = useMemo(() => {
    return (items: T[], search: string) => {
      if (!search.trim()) return items;

      return items.filter((item) => {
        return searchFields.some((field) => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(search.toLowerCase());
          }
          return false;
        });
      });
    };
  }, [searchFields]);

  const filterItems = useMemo(() => {
    return (items: T[]) => {
      if (!filters || Object.keys(filters).length === 0) return items;

      return items.filter((item) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          const itemValue = item[key as keyof T];
          
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          
          if (typeof value === 'object' && 'min' in value && 'max' in value) {
            return itemValue >= value.min && itemValue <= value.max;
          }
          
          return itemValue === value;
        });
      });
    };
  }, [filters]);

  useEffect(() => {
    const performSearch = async () => {
      setIsSearching(true);
      try {
        const searchResults = searchItems(items, debouncedSearch);
        const filteredResults = filterItems(searchResults);
        setResults(filteredResults);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearch, items, searchItems, filterItems]);

  return { results, isSearching };
}
