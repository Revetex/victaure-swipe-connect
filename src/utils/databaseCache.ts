
/**
 * Système de cache simple pour éviter de refaire les mêmes requêtes à la base de données
 * Ce cache est utilisé en mémoire temporairement
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class DatabaseCache {
  private cache: Record<string, CacheEntry<any>> = {};

  /**
   * Récupérer une valeur du cache ou l'ajouter si elle n'existe pas
   * @param key Clé de cache unique
   * @param fetcher Fonction qui récupère les données si elles ne sont pas dans le cache
   * @param ttl Durée de vie du cache en millisecondes
   */
  async get<T>(key: string, fetcher: () => Promise<T>, ttl: number = 60000): Promise<T> {
    // Vérifier si la donnée est dans le cache et n'est pas expirée
    const entry = this.cache[key];
    const now = Date.now();

    if (entry && now - entry.timestamp < ttl) {
      return entry.data;
    }

    // Si pas dans le cache ou expirée, on exécute le fetcher
    const data = await fetcher();
    
    // On met à jour le cache
    this.cache[key] = {
      data,
      timestamp: now
    };

    return data;
  }

  /**
   * Invalider toutes les entrées de cache qui correspondent à un pattern
   * @param pattern Pattern à rechercher dans les clés
   */
  invalidatePattern(pattern: string): void {
    for (const key in this.cache) {
      if (key.includes(pattern)) {
        delete this.cache[key];
      }
    }
  }

  /**
   * Vider complètement le cache
   */
  clear(): void {
    this.cache = {};
  }
}

// Exporter une instance unique
export const dbCache = new DatabaseCache();
