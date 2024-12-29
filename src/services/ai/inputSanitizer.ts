export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML/XML tags
    .trim()
    .slice(0, 1000); // Limit input length
}