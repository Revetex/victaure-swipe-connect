export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const calculateBackoff = (attempt: number, config: {
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}): number => {
  const backoffDelay = config.initialDelay * Math.pow(config.backoffFactor, attempt);
  return Math.min(backoffDelay, config.maxDelay);
};