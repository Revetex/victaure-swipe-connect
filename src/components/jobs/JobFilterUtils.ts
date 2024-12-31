export interface JobFilters {
  category: string;
  subcategory: string;
  duration: string;
  experienceLevel: string;
  location: string;
  province: string;
  searchTerm: string;
}

export const defaultFilters: JobFilters = {
  category: "",
  subcategory: "",
  duration: "",
  experienceLevel: "",
  location: "",
  province: "",
  searchTerm: ""
};