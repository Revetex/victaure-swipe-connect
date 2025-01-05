import { LucideIcon } from "lucide-react";
import { businessCategories } from "./businessCategories";
import { creativeCategories } from "./creativeCategories";
import { techCategories } from "./techCategories";

export interface CategoryConfig {
  icon: LucideIcon;
  subcategories: string[];
}

export type Categories = typeof businessCategories & typeof creativeCategories & typeof techCategories;

export const isValidCategory = (category: string): category is keyof Categories => {
  return category in { ...businessCategories, ...creativeCategories, ...techCategories };
};