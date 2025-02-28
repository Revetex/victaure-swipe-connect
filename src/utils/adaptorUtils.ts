
// Ce fichier contient des fonctions d'adaptation pour les composants protégés

/**
 * Convertit une valeur de statut en ligne au format booléen
 */
export function ensureBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || 
           value === '1' || 
           value === 'yes' || 
           value === 'online' || 
           value === 'on';
  }
  if (typeof value === 'number') return value !== 0;
  return !!value;
}

/**
 * Sécurise les chaînes pour éviter les erreurs toLowerCase sur never
 */
export function safeStringLowerCase(value: any): string {
  if (typeof value === 'string') return value.toLowerCase();
  return String(value || '').toLowerCase();
}

/**
 * Adapte un objet message pour s'assurer qu'il a toutes les propriétés requises
 */
export function adaptMessage(partialMessage: any): any {
  return {
    id: partialMessage.id || `temp-${Date.now()}`,
    content: partialMessage.content || '',
    sender_id: partialMessage.sender_id || (partialMessage.sender?.id || ''),
    receiver_id: partialMessage.receiver_id || '',
    created_at: partialMessage.created_at || new Date().toISOString(),
    read: !!partialMessage.read,
    ...partialMessage
  };
}

/**
 * Adapte les objets contenant des chaînes qui devraient être des booléens
 */
export function fixBooleanProps(props: any, booleanProps: string[] = ['isOnline', 'online', 'online_status']) {
  const result = { ...props };
  
  booleanProps.forEach(prop => {
    if (prop in result && typeof result[prop] === 'string') {
      result[prop] = ensureBoolean(result[prop]);
    }
  });
  
  return result;
}
