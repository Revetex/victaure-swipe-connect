export function parseDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  
  try {
    if (dateStr.toLowerCase().includes('just posted')) {
      return new Date().toISOString();
    }
    
    if (dateStr.toLowerCase().includes('hour')) {
      const hours = parseInt(dateStr) || 1;
      const date = new Date();
      date.setHours(date.getHours() - hours);
      return date.toISOString();
    }
    
    if (dateStr.toLowerCase().includes('day')) {
      const days = parseInt(dateStr) || 1;
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date.toISOString();
    }
    
    return new Date(dateStr).toISOString();
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date().toISOString();
  }
}