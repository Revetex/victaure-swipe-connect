
/**
 * Hook pour faciliter l'utilisation des requêtes Supabase avec React
 */
import { useState, useEffect, useCallback } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cacheManager } from '@/utils/cacheManager';
import { handleError } from '@/utils/errorHandler';

// Types pour les états de requête
export type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

// Options disponibles pour le hook
export interface UseSupabaseQueryOptions<T> {
  initialData?: T;
  enabled?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: PostgrestError) => void;
  select?: string;
  orderBy?: string;
  ascending?: boolean;
  filters?: Array<{ column: string; operator: string; value: any }>;
  limit?: number;
}

/**
 * Hook pour exécuter une requête de lecture sur une table Supabase
 */
export function useSupabaseQuery<T>(
  table: string,
  options: UseSupabaseQueryOptions<T> = {}
) {
  const {
    initialData,
    enabled = true,
    cacheKey,
    cacheTTL,
    onSuccess,
    onError,
    select = '*',
    orderBy,
    ascending = false,
    filters = [],
    limit
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [status, setStatus] = useState<QueryStatus>('idle');
  const [error, setError] = useState<PostgrestError | null>(null);
  const [count, setCount] = useState<number | null>(null);

  // Fonction pour exécuter la requête
  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setStatus('loading');

    // Génère une clé de cache si non fournie
    const actualCacheKey = cacheKey || 
      `${table}:query:${select}:${JSON.stringify(filters)}:${orderBy}:${ascending}:${limit}`;

    try {
      const result = await cacheManager.get<{ data: T; count: number | null }>(
        actualCacheKey,
        async () => {
          // Construction de la requête
          let query = supabase
            .from(table)
            .select(select, { count: 'exact' });

          // Application des filtres
          for (const filter of filters) {
            switch (filter.operator) {
              case 'eq':
                query = query.eq(filter.column, filter.value);
                break;
              case 'neq':
                query = query.neq(filter.column, filter.value);
                break;
              case 'gt':
                query = query.gt(filter.column, filter.value);
                break;
              case 'gte':
                query = query.gte(filter.column, filter.value);
                break;
              case 'lt':
                query = query.lt(filter.column, filter.value);
                break;
              case 'lte':
                query = query.lte(filter.column, filter.value);
                break;
              case 'like':
                query = query.like(filter.column, `%${filter.value}%`);
                break;
              case 'ilike':
                query = query.ilike(filter.column, `%${filter.value}%`);
                break;
              case 'in':
                query = query.in(filter.column, filter.value);
                break;
              case 'is':
                query = query.is(filter.column, filter.value);
                break;
              default:
                console.warn(`Opérateur non supporté: ${filter.operator}`);
            }
          }

          // Application du tri
          if (orderBy) {
            query = query.order(orderBy, { ascending });
          }

          // Application de la limite
          if (limit) {
            query = query.limit(limit);
          }

          // Exécution de la requête
          const { data, error, count } = await query;

          if (error) throw error;

          return { data: data as T, count };
        },
        cacheTTL
      );

      setData(result.data);
      setCount(result.count);
      setStatus('success');
      
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (error) {
      const pgError = error as PostgrestError;
      setError(pgError);
      setStatus('error');
      
      handleError(error, true);
      
      if (onError) {
        onError(pgError);
      }
    }
  }, [
    table, 
    enabled, 
    cacheKey, 
    cacheTTL, 
    onSuccess, 
    onError, 
    select, 
    orderBy, 
    ascending,
    filters,
    limit
  ]);

  // Fonction pour rafraîchir les données
  const refetch = useCallback(async () => {
    if (cacheKey) {
      cacheManager.invalidate(cacheKey);
    }
    await fetchData();
  }, [cacheKey, fetchData]);

  // Chargement initial des données
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return {
    data,
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    error,
    refetch,
    count
  };
}

/**
 * Hook pour la manipulation d'un enregistrement Supabase (create, update, delete)
 */
export function useSupabaseMutation<T extends { id?: string }>(
  table: string,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: PostgrestError) => void;
    invalidateQueries?: string[];
  } = {}
) {
  const { onSuccess, onError, invalidateQueries = [] } = options;
  
  const [status, setStatus] = useState<QueryStatus>('idle');
  const [error, setError] = useState<PostgrestError | null>(null);
  const [data, setData] = useState<T | null>(null);

  // Fonction pour réinitialiser l'état
  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setData(null);
  }, []);

  // Fonction pour invalider le cache après une mutation
  const invalidateCache = useCallback(() => {
    // Invalide les requêtes spécifiées
    for (const queryKey of invalidateQueries) {
      cacheManager.invalidateByPrefix(queryKey);
    }
    
    // Toujours invalider les requêtes pour cette table
    cacheManager.invalidateByPrefix(`${table}:`);
  }, [table, invalidateQueries]);

  // Fonction pour créer un enregistrement
  const create = useCallback(
    async (record: Partial<T>): Promise<T | null> => {
      setStatus('loading');
      
      try {
        const { data, error } = await supabase
          .from(table)
          .insert(record)
          .select('*')
          .single();
        
        if (error) throw error;

        setData(data as T);
        setStatus('success');
        invalidateCache();
        
        if (onSuccess) {
          onSuccess(data as T);
        }
        
        return data as T;
      } catch (error) {
        const pgError = error as PostgrestError;
        setError(pgError);
        setStatus('error');
        
        handleError(error, true);
        
        if (onError) {
          onError(pgError);
        }
        
        return null;
      }
    },
    [table, onSuccess, onError, invalidateCache]
  );

  // Fonction pour mettre à jour un enregistrement
  const update = useCallback(
    async (id: string, updates: Partial<T>): Promise<T | null> => {
      setStatus('loading');
      
      try {
        const { data, error } = await supabase
          .from(table)
          .update(updates)
          .eq('id', id)
          .select('*')
          .single();
        
        if (error) throw error;

        setData(data as T);
        setStatus('success');
        invalidateCache();
        
        if (onSuccess) {
          onSuccess(data as T);
        }
        
        return data as T;
      } catch (error) {
        const pgError = error as PostgrestError;
        setError(pgError);
        setStatus('error');
        
        handleError(error, true);
        
        if (onError) {
          onError(pgError);
        }
        
        return null;
      }
    },
    [table, onSuccess, onError, invalidateCache]
  );

  // Fonction pour supprimer un enregistrement
  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      setStatus('loading');
      
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id);
        
        if (error) throw error;

        setStatus('success');
        invalidateCache();
        
        if (onSuccess) {
          onSuccess({ id } as T);
        }
        
        return true;
      } catch (error) {
        const pgError = error as PostgrestError;
        setError(pgError);
        setStatus('error');
        
        handleError(error, true);
        
        if (onError) {
          onError(pgError);
        }
        
        return false;
      }
    },
    [table, onSuccess, onError, invalidateCache]
  );

  return {
    create,
    update,
    remove,
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    error,
    data,
    reset
  };
}
