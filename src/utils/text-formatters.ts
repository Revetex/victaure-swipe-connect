
/**
 * Formats a name to show initials (e.g., "John Doe" → "J.D.")
 */
export function formatNameInitials(name: string | null): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part[0]?.toUpperCase())
    .filter(Boolean)
    .join('.');
}

/**
 * Truncates text to a specified length and adds ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Formats a date to a readable string
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString();
}
