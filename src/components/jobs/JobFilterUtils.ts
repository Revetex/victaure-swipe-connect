
export interface JobFilters {
  category?: string;
  location?: string;
  province?: string;
  subcategory?: string;
  remoteType?: string;
  contractType?: string;
  experienceLevel?: string;
  searchTerm?: string;
  postedWithin?: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: boolean;
  urgent?: boolean;
  paymentSchedule?: string;
  source?: "regular" | "contract" | "marketplace";
}

export const defaultFilters: JobFilters = {
  searchTerm: "",
  category: "all",
  location: "",
  experienceLevel: "all",
  remote: false,
  postedWithin: "all",
  source: "regular"
};

export const filterLabels = {
  category: "Catégorie",
  location: "Lieu",
  experienceLevel: "Niveau d'expérience",
  remote: "Travail à distance",
  salary: "Salaire",
  postedWithin: "Publié dans les"
};
