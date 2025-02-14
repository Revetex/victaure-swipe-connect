
export interface JobFilters {
  searchTerm: string;
  category: string;
  location: string;
  experienceLevel: string;
  source: "regular" | "contract" | "marketplace" | "all";
  remote: boolean;
  salary: [number, number] | null;
  postedWithin: string;
  contractType?: string;
  remoteType?: string;
  salaryMin?: number;
  salaryMax?: number;
  paymentSchedule?: string;
}

export const defaultFilters: JobFilters = {
  searchTerm: "",
  category: "all",
  location: "",
  experienceLevel: "all",
  source: "regular",
  remote: false,
  salary: null,
  postedWithin: "all"
};

export const filterLabels = {
  category: "Catégorie",
  location: "Lieu",
  experienceLevel: "Niveau d'expérience",
  remote: "Travail à distance",
  salary: "Salaire",
  postedWithin: "Publié dans les"
};
