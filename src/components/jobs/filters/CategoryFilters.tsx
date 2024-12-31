import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFilters } from "../JobFilterUtils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function CategoryFilters({ filters, onFilterChange }: CategoryFiltersProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["jobCategories", filters.missionType],
    queryFn: async () => {
      const query = supabase
        .from("job_categories")
        .select("id, name")
        .order("name");

      if (filters.missionType !== "all") {
        query.eq("mission_type", filters.missionType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ["jobSubcategories", filters.category],
    queryFn: async () => {
      if (filters.category === "all") return [];

      const { data, error } = await supabase
        .from("job_subcategories")
        .select("id, name")
        .eq("category_id", filters.category)
        .order("name");

      if (error) throw error;
      return data;
    },
    enabled: filters.category !== "all",
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Type de mission
        </label>
        <Select
          value={filters.missionType}
          onValueChange={(value) => onFilterChange("missionType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="company">Entreprise</SelectItem>
            <SelectItem value="individual">Individuel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Catégorie
        </label>
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filters.category !== "all" && subcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Sous-catégorie
          </label>
          <Select
            value={filters.subcategory}
            onValueChange={(value) => onFilterChange("subcategory", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sous-catégories</SelectItem>
              {subcategories.map((subcat) => (
                <SelectItem key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}