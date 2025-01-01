export function parseDatePosted(dateText: string): string {
  const now = new Date();
  const text = dateText.toLowerCase();

  if (text.includes('just posted') || text.includes('today')) {
    return now.toISOString();
  }

  if (text.includes('yesterday')) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString();
  }

  const daysAgoMatch = text.match(/(\d+)\s*days?\s*ago/);
  if (daysAgoMatch) {
    const daysAgo = parseInt(daysAgoMatch[1]);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }

  return now.toISOString();
}