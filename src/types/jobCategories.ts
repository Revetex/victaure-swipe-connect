export type JobCategory = {
  id: string;
  name: string;
  icon?: string;
};

export type JobSubcategory = {
  id: string;
  category_id: string;
  name: string;
};