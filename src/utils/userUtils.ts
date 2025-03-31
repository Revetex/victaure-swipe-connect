
/**
 * Extrait les initiales d'un nom complet
 * @param name Nom complet
 * @returns Les initiales (max 2 caractères)
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Détermine si un utilisateur est en ligne
 * @param lastSeen Timestamp de dernière connexion
 * @param thresholdMinutes Minutes avant de considérer l'utilisateur comme hors ligne
 * @returns true si l'utilisateur est considéré comme en ligne
 */
export function isUserOnline(lastSeen: string | null, thresholdMinutes: number = 5): boolean {
  if (!lastSeen) return false;
  
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  
  // Différence en millisecondes
  const diffMs = now.getTime() - lastSeenDate.getTime();
  // Convertir en minutes
  const diffMinutes = diffMs / (1000 * 60);
  
  return diffMinutes <= thresholdMinutes;
}

/**
 * Formate un nom d'utilisateur pour l'affichage
 * @param fullName Nom complet
 * @param username Nom d'utilisateur
 * @returns Nom formaté pour l'affichage
 */
export function formatDisplayName(fullName: string | null, username: string | null): string {
  if (fullName && fullName.trim()) {
    return fullName.trim();
  }
  
  if (username && username.trim()) {
    return username.trim();
  }
  
  return "Utilisateur";
}
