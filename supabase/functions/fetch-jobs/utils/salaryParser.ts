export function parseSalary(salary: string): string {
  if (!salary) return '';

  // Remove currency symbols and extra whitespace
  return salary.replace(/[$€£]/g, '').replace(/\s+/g, ' ').trim();
}