export function parseLocation(location: string): string {
  try {
    // Remove extra whitespace and normalize
    return location.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Error parsing location:', error);
    return location;
  }
}