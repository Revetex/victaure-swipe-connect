import { constructionCategories } from "./constructionCategories";
import { techCategories } from "./techCategories";
import { businessCategories } from "./businessCategories";
import { creativeCategories } from "./creativeCategories";
import { CategoryConfig } from "./categoryTypes";

export const missionCategories: Record<string, CategoryConfig> = {
  ...constructionCategories,
  ...techCategories,
  ...businessCategories,
  ...creativeCategories
};

export * from "./categoryTypes";