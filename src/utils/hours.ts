export function calculateHoursWorked(startTime: string, endTime: string): number {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  
  const hoursWorked = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return hoursWorked < 0 ? 0 : hoursWorked;
}

export function formatHours(hours: number): string {
  return hours.toFixed(2);
}

export function isValidTimeFormat(time: string): boolean {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timePattern.test(time);
}
