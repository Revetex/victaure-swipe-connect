export function parseLocation(locationStr: string): string {
  if (!locationStr) return '';
  
  try {
    // Remove extra spaces and normalize
    const cleaned = locationStr.trim().replace(/\s+/g, ' ');
    
    // Check if it's remote
    if (cleaned.toLowerCase().includes('remote')) {
      return 'Remote';
    }
    
    // Extract city/province if possible
    const parts = cleaned.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      return `${parts[0]}, ${parts[1]}`;
    }
    
    return cleaned;
  } catch (error) {
    console.error('Error parsing location:', error);
    return locationStr;
  }
}