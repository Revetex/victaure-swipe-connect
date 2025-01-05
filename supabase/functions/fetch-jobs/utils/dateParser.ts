export function parseDate(dateStr: string): Date {
  try {
    if (!dateStr) return new Date();
    
    // Handle relative dates
    if (dateStr.includes('ago')) {
      const now = new Date();
      const num = parseInt(dateStr.match(/\d+/)?.[0] || '0');
      
      if (dateStr.includes('minute')) {
        now.setMinutes(now.getMinutes() - num);
      } else if (dateStr.includes('hour')) {
        now.setHours(now.getHours() - num);
      } else if (dateStr.includes('day')) {
        now.setDate(now.getDate() - num);
      } else if (dateStr.includes('week')) {
        now.setDate(now.getDate() - (num * 7));
      } else if (dateStr.includes('month')) {
        now.setMonth(now.getMonth() - num);
      }
      
      return now;
    }
    
    // Try parsing as ISO date
    return new Date(dateStr);
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date();
  }
}