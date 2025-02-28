
/**
 * Utilitaires pour faciliter et standardiser les interactions avec Supabase
 */
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./errorHandler";
import { cacheManager } from "./cacheManager";

/**
 * Options pour les requêtes
 */
interface QueryOptions {
  cacheKey?: string;
  cacheTTL?: number; // En millisecondes
  useCache?: boolean;
  showToastOnError?: boolean;
}

const DEFAULT_OPTIONS: QueryOptions = {
  useCache: true,
  showToastOnError: true
};

/**
 * Récupère un seul enregistrement en fonction de son ID
 */
export async function fetchById<T>(
  table: string,
  id: string,
  select: string = '*',
  options: QueryOptions = DEFAULT_OPTIONS
): Promise<T | null> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const { cacheKey, useCache, cacheTTL, showToastOnError } = mergedOptions;
  
  // Définit une clé de cache si non fournie
  const actualCacheKey = cacheKey || `${table}:${id}`;
  
  try {
    if (useCache) {
      return await cacheManager.get<T | null>(
        actualCacheKey,
        async () => {
          const { data, error } = await supabase
            .from(table)
            .select(select)
            .eq('id', id)
            .maybeSingle();
          
          if (error) throw error;
          return data as T;
        },
        cacheTTL
      );
    } else {
      // Sans cache
      const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as T;
    }
  } catch (error) {
    handleError(error, showToastOnError);
    return null;
  }
}

/**
 * Récupère une liste d'enregistrements avec filtres et pagination
 */
export async function fetchList<T>(
  table: string,
  {
    select = '*',
    filters = [],
    page = 1,
    pageSize = 20,
    orderBy,
    ascending = false,
    options = DEFAULT_OPTIONS
  }: {
    select?: string;
    filters?: Array<{ column: string; operator: string; value: any }>;
    page?: number;
    pageSize?: number;
    orderBy?: string;
    ascending?: boolean;
    options?: QueryOptions;
  }
): Promise<{ data: T[]; count: number | null }> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const { cacheKey, useCache, cacheTTL, showToastOnError } = mergedOptions;
  
  // Génère une clé de cache basée sur les paramètres
  const filtersStr = JSON.stringify(filters);
  const actualCacheKey = cacheKey || 
    `${table}:list:${select}:${filtersStr}:${page}:${pageSize}:${orderBy}:${ascending}`;
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  try {
    if (useCache) {
      return await cacheManager.get(
        actualCacheKey,
        async () => await executeListQuery<T>(table, select, filters, from, to, orderBy, ascending),
        cacheTTL
      );
    } else {
      return await executeListQuery<T>(table, select, filters, from, to, orderBy, ascending);
    }
  } catch (error) {
    handleError(error, showToastOnError);
    return { data: [], count: 0 };
  }
}

// Fonction interne pour exécuter la requête de liste
async function executeListQuery<T>(
  table: string,
  select: string,
  filters: Array<{ column: string; operator: string; value: any }>,
  from: number,
  to: number,
  orderBy?: string,
  ascending: boolean = false
): Promise<{ data: T[]; count: number | null }> {
  // Construction de la requête de base
  let query = supabase.from(table).select(select, { count: 'exact' });
  
  // Applique les filtres
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
  
  // Applique le tri
  if (orderBy) {
    query = query.order(orderBy, { ascending });
  }
  
  // Applique la pagination
  query = query.range(from, to);
  
  // Exécute la requête
  const { data, error, count } = await query;
  
  if (error) throw error;
  
  return { 
    data: (data || []) as T[],
    count 
  };
}

/**
 * Insère un nouvel enregistrement
 */
export async function insertRecord<T>(
  table: string,
  record: Partial<T>,
  options: QueryOptions & { returnRecord?: boolean } = { ...DEFAULT_OPTIONS, returnRecord: true }
): Promise<T | null> {
  const { showToastOnError, returnRecord } = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(record)
      .select(returnRecord ? '*' : '');
    
    if (error) throw error;
    
    // Invalide le cache pour cette table
    cacheManager.invalidateByPrefix(`${table}:`);
    
    return returnRecord ? (data?.[0] as T) : null;
  } catch (error) {
    handleError(error, showToastOnError);
    return null;
  }
}

/**
 * Met à jour un enregistrement existant
 */
export async function updateRecord<T>(
  table: string,
  id: string,
  updates: Partial<T>,
  options: QueryOptions & { returnRecord?: boolean } = { ...DEFAULT_OPTIONS, returnRecord: true }
): Promise<T | null> {
  const { showToastOnError, returnRecord } = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select(returnRecord ? '*' : '');
    
    if (error) throw error;
    
    // Invalide le cache pour cet enregistrement et les listes
    cacheManager.invalidate(`${table}:${id}`);
    cacheManager.invalidateByPrefix(`${table}:list:`);
    
    return returnRecord ? (data?.[0] as T) : null;
  } catch (error) {
    handleError(error, showToastOnError);
    return null;
  }
}

/**
 * Supprime un enregistrement
 */
export async function deleteRecord(
  table: string,
  id: string,
  options: QueryOptions = DEFAULT_OPTIONS
): Promise<boolean> {
  const { showToastOnError } = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Invalide le cache pour cet enregistrement et les listes
    cacheManager.invalidate(`${table}:${id}`);
    cacheManager.invalidateByPrefix(`${table}:list:`);
    
    return true;
  } catch (error) {
    handleError(error, showToastOnError);
    return false;
  }
}

/**
 * Exécute une requête RPC (Remote Procedure Call) sur Supabase
 */
export async function callRPC<T>(
  functionName: string,
  params: Record<string, any>,
  options: QueryOptions = DEFAULT_OPTIONS
): Promise<T | null> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const { cacheKey, useCache, cacheTTL, showToastOnError } = mergedOptions;
  
  // Génère une clé de cache basée sur les paramètres
  const paramsStr = JSON.stringify(params);
  const actualCacheKey = cacheKey || `rpc:${functionName}:${paramsStr}`;
  
  try {
    if (useCache) {
      return await cacheManager.get<T | null>(
        actualCacheKey,
        async () => {
          const { data, error } = await supabase.rpc(functionName, params);
          if (error) throw error;
          return data as T;
        },
        cacheTTL
      );
    } else {
      const { data, error } = await supabase.rpc(functionName, params);
      if (error) throw error;
      return data as T;
    }
  } catch (error) {
    handleError(error, showToastOnError);
    return null;
  }
}

/**
 * Utilitaires pour les opérations avec les fichiers Storage
 */
export const storageHelpers = {
  /**
   * Télécharge un fichier
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options: { cacheControl?: string; showToastOnError?: boolean } = { showToastOnError: true }
  ): Promise<string | null> {
    const { showToastOnError, cacheControl } = options;
    
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: cacheControl || '3600', upsert: true });
      
      if (error) throw error;
      
      // Récupère l'URL publique
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
      
      return publicUrl;
    } catch (error) {
      handleError(error, showToastOnError);
      return null;
    }
  },
  
  /**
   * Télécharge plusieurs fichiers
   */
  async uploadFiles(
    bucket: string,
    basePath: string,
    files: File[],
    options: { cacheControl?: string; showToastOnError?: boolean } = { showToastOnError: true }
  ): Promise<string[]> {
    const urls: string[] = [];
    
    for (const file of files) {
      const path = `${basePath}/${Date.now()}-${file.name}`;
      const url = await this.uploadFile(bucket, path, file, options);
      
      if (url) {
        urls.push(url);
      }
    }
    
    return urls;
  },
  
  /**
   * Supprime un fichier
   */
  async deleteFile(
    bucket: string,
    path: string,
    options: { showToastOnError?: boolean } = { showToastOnError: true }
  ): Promise<boolean> {
    const { showToastOnError } = options;
    
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, showToastOnError);
      return false;
    }
  }
};
