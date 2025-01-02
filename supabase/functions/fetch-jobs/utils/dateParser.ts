export function parseDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;

  try {
    // Handle relative dates
    if (dateStr.includes('today')) {
      return new Date();
    }
    if (dateStr.includes('yesterday')) {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date;
    }
    if (dateStr.includes('days ago')) {
      const days = parseInt(dateStr);
      if (!isNaN(days)) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
      }
    }

    // Try parsing as regular date
    return new Date(dateStr);
  } catch (error) {
    console.error('Error parsing date:', error);
    return undefined;
  }
}