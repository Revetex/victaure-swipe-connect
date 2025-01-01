export function parseLocation(location: string): string {
  const cleaned = location.trim()
    .replace(/\s+/g, ' ')
    .replace(/\([^)]*\)/g, '')
    .trim();

  const parts = cleaned.split(',').map(part => part.trim());
  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[1]}`;
  }
  return cleaned;
}

export function isCanadianLocation(location: string): boolean {
  return location.toLowerCase().includes('canada');
}