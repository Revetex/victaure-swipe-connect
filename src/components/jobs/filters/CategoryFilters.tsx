
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryIcon } from "@/components/skills/CategoryIcon";
import { toast } from "sonner";

interface CategoryFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function CategoryFilters({ filters, onFilterChange }: CategoryFiltersProps) {
  // Fetch categories from the database
  const { data: categories = [], isError: isCategoriesError } = useQuery({
    queryKey: ['job-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        toast.error("Erreur lors du chargement des catégories");
        throw error;
      }
      
      // Create a Map to remove duplicates based on name
      const uniqueCategories = Array.from(
        new Map(data.map(item => [item.name, item])).values()
      );
      
      return uniqueCategories;
    }
  });

  // Fetch subcategories based on selected category
  const { data: subcategories = [], isError: isSubcategoriesError } = useQuery({
    queryKey: ['job-subcategories', filters.category],
    queryFn: async () => {
      if (filters.category === 'all') return [];

      const { data, error } = await supabase
        .from('job_subcategories')
        .select('*')
        .eq('category_id', filters.category)
        .order('name');
      
      if (error) {
        console.error('Error fetching subcategories:', error);
        toast.error("Erreur lors du chargement des sous-catégories");
        throw error;
      }
      
      // Create a Map to remove duplicates based on name
      const uniqueSubcategories = Array.from(
        new Map(data.map(item => [item.name, item])).values()
      );
      
      return uniqueSubcategories;
    },
    // Only fetch subcategories if a specific category is selected
    enabled: filters.category !== 'all' && filters.category !== null && filters.category !== undefined
  });

  if (isCategoriesError || isSubcategoriesError) {
    console.error("Error fetching categories or subcategories");
    toast.error("Une erreur est survenue lors du chargement des catégories");
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => {
            onFilterChange("category", value);
            // Reset subcategory when category changes
            if (value !== filters.category) {
              onFilterChange("subcategory", "all");
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[300px]">
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={category.name} />
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      {filters.category && filters.category !== 'all' && (
        <div className="space-y-2">
          <Label>Sous-catégorie</Label>
          <Select
            value={filters.subcategory || 'all'}
            onValueChange={(value) => onFilterChange("subcategory", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                <SelectItem value="all">Toutes les sous-catégories</SelectItem>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
