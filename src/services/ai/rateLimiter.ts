// Rate limiting implementation
const rateLimiter = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRateLimit = rateLimiter.get(userId);

  if (!userRateLimit) {
    rateLimiter.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (now - userRateLimit.timestamp > RATE_WINDOW) {
    rateLimiter.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (userRateLimit.count >= RATE_LIMIT) {
    return false;
  }

  userRateLimit.count += 1;
  return true;
}