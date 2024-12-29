import { technicalSkills } from './skills/technicalSkills';
import { creativeSkills } from './skills/creativeSkills';
import { businessSkills } from './skills/businessSkills';
import { constructionSkills } from './skills/constructionSkills';
import { industrySkills } from './skills/industrySkills';

export const skillCategories = {
  ...technicalSkills,
  ...creativeSkills,
  ...businessSkills,
  ...constructionSkills,
  ...industrySkills
};

// Flatten all skills into a single array for the predefined skills list
export const predefinedSkills = Object.values(skillCategories)
  .flatMap(category => Object.values(category))
  .flat()
  .sort();