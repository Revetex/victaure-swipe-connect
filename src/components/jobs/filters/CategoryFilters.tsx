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
import { missionCategories } from "@/types/categories";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryIcon } from "@/components/skills/CategoryIcon";

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
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[300px]">
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {Object.entries(missionCategories).map(([key, category]) => (
                <SelectItem key={key} value={key} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={key} />
                    <span>{key}</span>
                  </div>
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      {filters.category !== 'all' && (
        <div className="space-y-2">
          <Label>Sous-catégorie</Label>
          <Select
            value={filters.subcategory}
            onValueChange={(value) => onFilterChange("subcategory", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                <SelectItem value="all">Toutes les sous-catégories</SelectItem>
                {missionCategories[filters.category as keyof typeof missionCategories]?.subcategories.map((subcategory) => (
                  <SelectItem key={subcategory} value={subcategory}>
                    {subcategory}
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