
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
  // Unified source type to include all possible values
  source?: 'internal' | 'external' | 'regular' | 'contract' | 'marketplace';
  paymentSchedule?: string;
  contractType?: string;
  missionType?: 'company' | 'individual';
  // Add date filter properties
  createdAfter?: string;
  createdBefore?: string;
  deadlineBefore?: string;
}
