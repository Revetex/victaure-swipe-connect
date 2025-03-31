
/**
 * Convertit une valeur en booléen
 */
export function convertToBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value === 'online' || value === 'true' || value === '1';
  }
  return !!value;
}

/**
 * Formate un prix avec une devise
 */
export function formatPrice(price: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Génère un identifiant unique
 */
export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Assure qu'une valeur est une chaîne de caractères
 */
export function ensureStringLiteral(value: any): string {
  return typeof value === 'string' ? value : String(value);
}

/**
 * Adapte les données d'une annonce pour l'affichage
 */
export function adaptListingData(data: any): any {
  if (!data) return null;
  return {
    ...data,
    price: data.price || 0,
    online_status: convertToBoolean(data.online_status),
  };
}
