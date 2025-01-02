export function parseLocation(location: string): string {
  if (!location) return '';
  
  // Remove extra whitespace and normalize
  return location.replace(/\s+/g, ' ').trim();
}