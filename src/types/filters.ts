
export interface JobFilters {
  category?: string;
  subcategory?: string;
  duration?: string;
  experienceLevel?: string;
  location?: string;
  province?: string;
  remoteType?: string;
  minBudget?: number;
  maxBudget?: number;
  skills?: string[];
  searchTerm?: string;
  postedWithin?: string;
  remote?: boolean;
  urgent?: boolean;
  source?: 'internal' | 'external';
  paymentSchedule?: string;
}
