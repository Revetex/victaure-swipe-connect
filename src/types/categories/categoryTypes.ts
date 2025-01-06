import { LucideIcon } from "lucide-react";
import { businessCategories } from "./businessCategories";
import { techCategories } from "./techCategories";
import { creativeCategories } from "./creativeCategories";
import { constructionCategories } from "./constructionCategories";
import { serviceCategories } from "./serviceCategories";
import { educationCategories } from "./educationCategories";
import { healthCategories } from "./healthCategories";
import { hospitalityCategories } from "./hospitalityCategories";

export interface CategoryConfig {
  icon: LucideIcon;
  subcategories: string[];
}

export type Categories = typeof businessCategories & 
                        typeof techCategories & 
                        typeof creativeCategories & 
                        typeof constructionCategories &
                        typeof serviceCategories &
                        typeof educationCategories &
                        typeof healthCategories &
                        typeof hospitalityCategories;

export type ValidCategory = keyof Categories;

export const isValidCategory = (category: string): category is ValidCategory => {
  return Object.keys({
    ...businessCategories,
    ...techCategories,
    ...creativeCategories,
    ...constructionCategories,
    ...serviceCategories,
    ...educationCategories,
    ...healthCategories,
    ...hospitalityCategories
  }).includes(category);
};

export interface CategoryOption {
  id: string;
  label: string;
  icon: LucideIcon;
  subcategories: SubcategoryOption[];
}

export interface SubcategoryOption {
  id: string;
  label: string;
  categoryId: string;
}