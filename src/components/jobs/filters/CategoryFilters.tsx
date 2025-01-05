import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { JobFilters } from "../JobFilterUtils";

interface CategoryFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function CategoryFilters({ filters, onFilterChange }: CategoryFiltersProps) {
  const categories = [
    "Technology",
    "Design",
    "Marketing",
    "Sales",
    "Customer Service",
    "Other"
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Catégories</label>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={category}
              checked={filters.categories.includes(category)}
              onCheckedChange={(checked) => {
                const newCategories = checked
                  ? [...filters.categories, category]
                  : filters.categories.filter((c) => c !== category);
                onFilterChange("categories", newCategories);
              }}
            />
            <Label htmlFor={category}>{category}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}