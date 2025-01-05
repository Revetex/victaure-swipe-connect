export function parseSalary(salaryStr: string): string {
  if (!salaryStr) return '';
  
  try {
    // Remove currency symbols and extra spaces
    const cleaned = salaryStr.replace(/[$€£]/g, '').trim();
    
    // Extract numbers
    const numbers = cleaned.match(/\d+([.,]\d+)?/g);
    if (!numbers) return '';
    
    // If we have a range, format it
    if (numbers.length >= 2) {
      return `${numbers[0]}-${numbers[1]} ${cleaned.includes('$') ? 'CAD' : 'CAD'}/year`;
    }
    
    // Single number
    return `${numbers[0]} ${cleaned.includes('$') ? 'CAD' : 'CAD'}/year`;
  } catch (error) {
    console.error('Error parsing salary:', error);
    return '';
  }
}