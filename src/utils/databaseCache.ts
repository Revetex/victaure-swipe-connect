
/**
 * Service de mise en cache pour les requêtes à la base de données
 * Permet d'éviter les requêtes redondantes et les doublons dans les données
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiry: number; // durée de validité en ms
};

class DatabaseCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  
  // Durée de validité par défaut: 30 secondes
  private defaultExpiry = 30000;

  /**
   * Récupère des données du cache ou effectue la requête si nécessaire
   * @param key Clé unique pour identifier la requête
   * @param fetchFn Fonction de récupération des données
   * @param expiryTime Durée de validité du cache en ms
   */
  async get<T>(key: string, fetchFn: () => Promise<T>, expiryTime = this.defaultExpiry): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    // Si en cache et valide
    if (cached && (now - cached.timestamp) < cached.expiry) {
      console.log(`[Cache] Using cached data for: ${key}`);
      return cached.data;
    }

    // Sinon, effectuer la requête
    console.log(`[Cache] Fetching fresh data for: ${key}`);
    const data = await fetchFn();
    
    // Mettre en cache
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: expiryTime
    });

    return data;
  }

  /**
   * Invalidate une entrée spécifique du cache
   */
  invalidate(key: string): void {
    if (this.cache.has(key)) {
      console.log(`[Cache] Invalidating: ${key}`);
      this.cache.delete(key);
    }
  }

  /**
   * Invalide toutes les entrées du cache contenant une clé spécifique
   */
  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    const matchingKeys = keys.filter(key => key.includes(pattern));
    
    console.log(`[Cache] Invalidating ${matchingKeys.length} entries matching: ${pattern}`);
    
    matchingKeys.forEach(key => {
      this.cache.delete(key);
    });
  }

  /**
   * Vide entièrement le cache
   */
  clear(): void {
    console.log(`[Cache] Clearing entire cache (${this.cache.size} entries)`);
    this.cache.clear();
  }
}

// Singleton
export const dbCache = new DatabaseCache();
