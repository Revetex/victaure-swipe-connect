import { LucideIcon } from "lucide-react";

export interface CategoryConfig {
  icon: LucideIcon;
  subcategories: string[];
}

export type ValidCategory = keyof typeof missionCategories;

export const isValidCategory = (category: string): category is ValidCategory => {
  return category in missionCategories;
};