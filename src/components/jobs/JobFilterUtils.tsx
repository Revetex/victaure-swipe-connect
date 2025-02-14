
export interface JobFilters {
  searchTerm: string;
  category: string;
  location: string;
  type: "regular" | "contract" | "marketplace";
  experienceLevel: string;
  source: "internal" | "external" | "all";
  remote: boolean;
  salary: [number, number] | null;
  postedWithin: string;
}

export const defaultFilters: JobFilters = {
  searchTerm: "",
  category: "all",
  location: "",
  type: "regular",
  experienceLevel: "all",
  source: "all",
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
