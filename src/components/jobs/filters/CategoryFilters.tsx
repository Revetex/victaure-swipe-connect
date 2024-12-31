import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFilters } from "../JobFilterUtils";
import { memo, useMemo } from "react";
import { missionCategories } from "@/types/job";

interface CategoryFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export const CategoryFilters = memo(function CategoryFilters({ 
  filters, 
  onFilterChange 
}: CategoryFiltersProps) {
  const sortedCategories = useMemo(() => {
    if (filters.missionType === "company") {
      return Object.keys(missionCategories.company).sort((a, b) => a.localeCompare(b));
    } else if (filters.missionType === "individual") {
      return Object.keys(missionCategories.individual).sort((a, b) => a.localeCompare(b));
    }
    return Object.keys(missionCategories.company)
      .concat(Object.keys(missionCategories.individual))
      .sort((a, b) => a.localeCompare(b));
  }, [filters.missionType]);

  const subcategories = useMemo(() => 
    filters.category !== "all" && filters.missionType !== "all" ? 
      missionCategories[filters.missionType][filters.category]?.subcategories.sort((a, b) => a.localeCompare(b)) : 
      [],
    [filters.category, filters.missionType]
  );

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
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="company">Entreprise</SelectItem>
            <SelectItem value="individual">Particulier</SelectItem>
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
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {sortedCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filters.category !== "all" && filters.missionType !== "all" && (
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