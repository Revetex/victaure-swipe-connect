import { supabase } from "@/integrations/supabase/client";

export interface JobFilters {
  category: string;
  subcategory: string;
  duration: string;
  experienceLevel: string;
  location: string;
  province: string;
  remoteType: string;
  minBudget: number;
  maxBudget: number;
  skills: string[];
  searchTerm: string;
  createdAfter: string | null;
  createdBefore: string | null;
  deadlineBefore: string | null;
  missionType: "company" | "individual" | "all";
  paymentSchedule: string;
}

export const defaultFilters: JobFilters = {
  category: "all",
  subcategory: "all",
  duration: "all",
  experienceLevel: "all",
  location: "",
  province: "",
  remoteType: "all",
  minBudget: 300,
  maxBudget: 1000,
  skills: [],
  searchTerm: "",
  createdAfter: null,
  createdBefore: null,
  deadlineBefore: null,
  missionType: "all",
  paymentSchedule: "all"
};

export const applyJobFilters = (query: any, filters: JobFilters) => {
  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.subcategory && filters.subcategory !== "all") {
    query = query.eq("subcategory", filters.subcategory);
  }

  if (filters.duration && filters.duration !== "all") {
    query = query.eq("contract_type", filters.duration);
  }

  if (filters.experienceLevel && filters.experienceLevel !== "all") {
    query = query.eq("experience_level", filters.experienceLevel);
  }

  if (filters.location) {
    query = query.eq("location", filters.location);
  }

  if (filters.remoteType && filters.remoteType !== "all") {
    query = query.eq("remote_type", filters.remoteType);
  }

  if (filters.minBudget && filters.maxBudget) {
    query = query
      .gte("budget", filters.minBudget)
      .lte("budget", filters.maxBudget);
  }

  if (filters.missionType && filters.missionType !== "all") {
    query = query.eq("mission_type", filters.missionType);
  }

  if (filters.paymentSchedule && filters.paymentSchedule !== "all") {
    query = query.eq("payment_schedule", filters.paymentSchedule);
  }

  if (filters.searchTerm) {
    query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  return query;
};