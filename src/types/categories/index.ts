import { constructionCategories } from "./constructionCategories";
import { techCategories } from "./techCategories";
import { businessCategories } from "./businessCategories";
import { creativeCategories } from "./creativeCategories";
import { serviceCategories } from "./serviceCategories";
import { educationCategories } from "./educationCategories";
import { healthCategories } from "./healthCategories";
import { hospitalityCategories } from "./hospitalityCategories";
import { CategoryConfig } from "./categoryTypes";

export const missionCategories: Record<string, CategoryConfig> = {
  ...constructionCategories,
  ...techCategories,
  ...businessCategories,
  ...creativeCategories,
  ...serviceCategories,
  ...educationCategories,
  ...healthCategories,
  ...hospitalityCategories
};

export * from "./categoryTypes";