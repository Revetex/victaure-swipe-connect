
export function getLocationDistribution(jobs: any[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  jobs.forEach(job => {
    const location = job.location || 'Unknown';
    distribution[location] = (distribution[location] || 0) + 1;
  });
  
  return distribution;
}
