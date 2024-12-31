import { JobFilters } from "../JobFilterUtils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

interface CategoryFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

type JobCategory = Database['public']['Tables']['job_categories']['Row'];
type JobSubcategory = Database['public']['Tables']['job_subcategories']['Row'];

export function CategoryFilters({ filters, onFilterChange }: CategoryFiltersProps) {
  const { data: categories = [] } = useQuery<JobCategory[]>({
    queryKey: ["jobCategories", filters.missionType],
    queryFn: async () => {
      const query = supabase
        .from('job_categories')
        .select('*')
        .order('name');

      if (filters.missionType !== "all") {
        query.eq('mission_type', filters.missionType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: subcategories = [] } = useQuery<JobSubcategory[]>({
    queryKey: ["jobSubcategories", filters.category],
    queryFn: async () => {
      if (filters.category === "all") return [];

      const { data, error } = await supabase
        .from('job_subcategories')
        .select('*')
        .eq('category_id', filters.category)
        .order('name');

      if (error) throw error;
      return data || [];
    },
    enabled: filters.category !== "all",
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Catégorie
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {filters.category !== "all" && subcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Sous-catégorie
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            value={filters.subcategory}
            onChange={(e) => onFilterChange("subcategory", e.target.value)}
          >
            <option value="all">Toutes les sous-catégories</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}