
/**
 * Gestionnaire de cache pour optimiser les requêtes et réduire les appels à l'API
 */

type CacheItem<T> = {
  data: T;
  timestamp: number;
  expiry: number;
};

class CacheManager {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes en millisecondes

  /**
   * Récupère une valeur du cache ou l'ajoute si elle n'existe pas
   * @param key Clé unique pour identifier les données en cache
   * @param fetcher Fonction qui retourne une Promise pour récupérer les données
   * @param ttl Durée de vie du cache en ms (5 minutes par défaut)
   */
  async get<T>(key: string, fetcher: () => Promise<T>, ttl = this.DEFAULT_TTL): Promise<T> {
    const now = Date.now();
    const cachedItem = this.cache.get(key);

    // Si l'élément est en cache et n'est pas expiré
    if (cachedItem && now < cachedItem.expiry) {
      console.log(`[Cache] Hit: ${key}`);
      return cachedItem.data;
    }

    // Récupère les données fraîches
    console.log(`[Cache] Miss: ${key}`);
    try {
      const data = await fetcher();
      
      // Stocke les résultats dans le cache
      this.cache.set(key, {
        data,
        timestamp: now,
        expiry: now + ttl
      });
      
      return data;
    } catch (error) {
      // En cas d'erreur lors de la récupération des données
      console.error(`[Cache] Error fetching data for key ${key}:`, error);
      
      // Si des données expirées sont disponibles, on les utilise comme fallback
      if (cachedItem) {
        console.log(`[Cache] Using stale data for key ${key}`);
        return cachedItem.data;
      }
      
      throw error;
    }
  }

  /**
   * Invalide une entrée spécifique du cache
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`[Cache] Invalidated: ${key}`);
  }

  /**
   * Invalide toutes les entrées du cache qui correspondent à un préfixe
   */
  invalidateByPrefix(prefix: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`[Cache] Invalidated ${keysToDelete.length} entries with prefix: ${prefix}`);
  }

  /**
   * Définit ou met à jour une entrée dans le cache
   */
  set<T>(key: string, data: T, ttl = this.DEFAULT_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + ttl
    });
    console.log(`[Cache] Set: ${key}`);
  }

  /**
   * Vide entièrement le cache
   */
  clear(): void {
    this.cache.clear();
    console.log(`[Cache] Cleared all entries`);
  }
}

// Exporte une instance singleton du gestionnaire de cache
export const cacheManager = new CacheManager();
