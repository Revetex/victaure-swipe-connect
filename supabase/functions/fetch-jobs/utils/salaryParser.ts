export function parseSalary(salary: string): string {
  try {
    if (!salary) return '';
    
    // Remove currency symbols and extra spaces
    const cleanSalary = salary.replace(/[$€£]/g, '').replace(/\s+/g, ' ').trim();
    
    // Extract numbers
    const numbers = cleanSalary.match(/\d+([.,]\d+)?/g);
    if (!numbers) return cleanSalary;
    
    // If range, format as range
    if (numbers.length >= 2) {
      return `${numbers[0]}-${numbers[1]} CAD`;
    }
    
    // Single number
    return `${numbers[0]} CAD`;
  } catch (error) {
    console.error('Error parsing salary:', error);
    return salary;
  }
}