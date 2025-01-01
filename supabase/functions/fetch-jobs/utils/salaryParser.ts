export function extractSalaryRange(text: string): string | undefined {
  const patterns = [
    /\$(\d{1,3}(,\d{3})*(\.\d{2})?)\s*-\s*\$(\d{1,3}(,\d{3})*(\.\d{2})?)/i,
    /(\d{2,3}k)\s*-\s*(\d{2,3}k)/i,
    /\$(\d{1,3}(,\d{3})*(\.\d{2})?)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return undefined;
}

export function isSalaryWithinLimit(salaryRange: string | undefined, maxSalary: number = 200000): boolean {
  if (!salaryRange) return true;
  
  const salary = salaryRange.replace(/[^0-9]/g, '');
  const maxExtracted = parseInt(salary);
  return !maxExtracted || maxExtracted < maxSalary;
}