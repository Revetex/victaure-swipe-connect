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
  salary?: [number, number];
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
  source: "regular",
  salary: [30000, 200000]
};

export const filterLabels = {
  category: "Catégorie",
  location: "Lieu",
  experienceLevel: "Niveau d'expérience",
  remote: "Travail à distance",
  salary: "Salaire",
  postedWithin: "Publié dans les"
};

export const experienceLevels = [
  "Débutant",
  "Junior (1-3 ans)",
  "Intermédiaire (3-5 ans)",
  "Senior (5-8 ans)",
  "Expert (8+ ans)"
] as const;

export const remoteTypes = [
  "Sur place",
  "Hybride",
  "Télétravail"
] as const;

export const contractTypes = [
  "CDI",
  "CDD",
  "Freelance",
  "Stage",
  "Alternance"
] as const;

export const postedWithinOptions = [
  { label: "24 dernières heures", value: "24h" },
  { label: "3 derniers jours", value: "3d" },
  { label: "7 derniers jours", value: "7d" },
  { label: "30 derniers jours", value: "30d" },
  { label: "Tout", value: "all" }
] as const;
