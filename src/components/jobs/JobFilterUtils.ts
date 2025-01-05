export interface JobFilters {
  searchTerm: string;
  category: string;
  subcategory: string;
  location: string;
  duration: string;
  experienceLevel: string;
  minBudget: number;
  maxBudget: number;
}

export const defaultFilters: JobFilters = {
  searchTerm: "",
  category: "all",
  subcategory: "all",
  location: "all",
  duration: "all",
  experienceLevel: "all",
  minBudget: 0,
  maxBudget: 100000,
};