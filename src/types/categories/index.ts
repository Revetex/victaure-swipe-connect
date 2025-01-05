import { businessCategories } from "./businessCategories";
import { techCategories } from "./techCategories";
import { creativeCategories } from "./creativeCategories";
import type { CategoryConfig } from "./categoryTypes";

export const missionCategories: Record<string, CategoryConfig> = {
  ...businessCategories,
  ...techCategories,
  ...creativeCategories
};

export * from "./categoryTypes";