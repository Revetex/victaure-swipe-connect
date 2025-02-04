export class RateLimiter {
  private attempts: { timestamp: number }[];
  private maxAttempts: number;
  private timeWindow: number;

  constructor(maxAttempts: number, timeWindow: number) {
    this.attempts = [];
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
  }

  canAttempt(): boolean {
    const now = Date.now();
    // Remove expired attempts
    this.attempts = this.attempts.filter(
      attempt => now - attempt.timestamp < this.timeWindow
    );
    
    return this.attempts.length < this.maxAttempts;
  }

  addAttempt(): void {
    this.attempts.push({ timestamp: Date.now() });
  }

  getRemainingTime(): number {
    if (this.attempts.length === 0) return 0;
    const oldestAttempt = this.attempts[0].timestamp;
    const now = Date.now();
    return Math.max(0, this.timeWindow - (now - oldestAttempt));
  }
}