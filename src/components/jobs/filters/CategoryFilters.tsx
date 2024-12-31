import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFilters } from "../JobFilterUtils";
import { missionCategories } from "@/types/job";
import { memo, useMemo } from "react";

interface CategoryFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export const CategoryFilters = memo(function CategoryFilters({ 
  filters, 
  onFilterChange 
}: CategoryFiltersProps) {
  const subcategories = useMemo(() => 
    filters.category !== "all" ? missionCategories[filters.category]?.subcategories : [],
    [filters.category]
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Catégorie
        </label>
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {Object.keys(missionCategories).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filters.category !== "all" && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Sous-catégorie
          </label>
          <Select
            value={filters.subcategory}
            onValueChange={(value) => onFilterChange("subcategory", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les sous-catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sous-catégories</SelectItem>
              {subcategories?.map((subcat) => (
                <SelectItem key={subcat} value={subcat}>
                  {subcat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
});