
/**
 * Utilitaire simple de cache pour les requêtes de base de données
 */
interface CacheEntry {
  data: any;
  timestamp: number;
  expiry: number;
}

class DatabaseCache {
  private cache: Map<string, CacheEntry> = new Map();

  /**
   * Obtient une valeur du cache ou l'ajoute si elle n'existe pas
   */
  async get<T>(key: string, fetcher: () => Promise<T>, ttl: number = 60000): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    // Si la valeur est en cache et n'a pas expiré, la retourner
    if (cached && now < cached.timestamp + cached.expiry) {
      return cached.data as T;
    }

    // Sinon, exécuter le fetcher et mettre en cache le résultat
    const data = await fetcher();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: ttl
    });

    return data;
  }

  /**
   * Invalide une entrée spécifique du cache
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalide toutes les entrées du cache dont la clé correspond au motif
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Vide complètement le cache
   */
  clear(): void {
    this.cache.clear();
  }
}

export const dbCache = new DatabaseCache();
