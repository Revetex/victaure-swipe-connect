export interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

export interface JobFilters {
  searchTerm?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  dateRange?: DateFilter;
  experienceLevel?: string;
  duration?: string;
}