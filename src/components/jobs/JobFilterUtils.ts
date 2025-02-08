
import { Job } from "@/types/job";
import { JobFilters, defaultFilters } from "@/types/filters";

export { JobFilters, defaultFilters };

export class JobFilterUtils {
  static applyFilters(jobs: Job[], filters: JobFilters): Job[] {
    return jobs.filter(job => {
      // Filtre par recherche textuelle
      if (filters.searchTerm && !this.matchesSearchTerm(job, filters.searchTerm)) {
        return false;
      }

      // Filtre par catégorie
      if (filters.category !== "all" && job.category !== filters.category) {
        return false;
      }

      // Filtre par type de contrat
      if (filters.duration !== "all" && job.contract_type !== filters.duration) {
        return false;
      }

      // Filtre par niveau d'expérience
      if (filters.experienceLevel !== "all" && job.experience_level !== filters.experienceLevel) {
        return false;
      }

      // Filtre par localisation
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Filtre par budget
      if (filters.minBudget && job.budget < filters.minBudget) {
        return false;
      }
      if (filters.maxBudget && job.budget > filters.maxBudget) {
        return false;
      }

      return true;
    });
  }

  private static matchesSearchTerm(job: Job, searchTerm: string): boolean {
    const searchLower = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.company?.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower)
    );
  }
}
