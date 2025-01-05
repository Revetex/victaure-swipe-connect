import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { JobFilters } from "../JobFilterUtils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function CategoryFilters({ filters, onFilterChange }: CategoryFiltersProps) {
  // Fetch categories from the database with distinct values
  const { data: categories = [] } = useQuery({
    queryKey: ['job-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Remove duplicates based on name
      const uniqueCategories = data.reduce((acc: any[], current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        }
        return acc;
      }, []);
      
      return uniqueCategories;
    }
  });

  // Fetch subcategories based on selected category
  const { data: subcategories = [] } = useQuery({
    queryKey: ['job-subcategories', filters.category],
    queryFn: async () => {
      if (filters.category === 'all') return [];

      const { data, error } = await supabase
        .from('job_subcategories')
        .select('*')
        .eq('category_id', filters.category)
        .order('name');
      
      if (error) throw error;
      
      // Remove duplicates based on name
      const uniqueSubcategories = data.reduce((acc: any[], current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        }
        return acc;
      }, []);
      
      return uniqueSubcategories;
    },
    enabled: filters.category !== 'all'
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Select
          value={filters.category}
          onValueChange={(value) => {
            onFilterChange("category", value);
            if (value !== filters.category) {
              onFilterChange("subcategory", "all");
            }
          }}
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

      <div className="space-y-2">
        <Label>Sous-catégorie</Label>
        <Select
          value={filters.subcategory}
          onValueChange={(value) => onFilterChange("subcategory", value)}
          disabled={filters.category === 'all'}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une sous-catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sous-catégories</SelectItem>
            {subcategories.map((subcategory) => (
              <SelectItem key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}