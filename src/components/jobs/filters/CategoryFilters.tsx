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
  // Fetch categories from the database
  const { data: categories = [] } = useQuery({
    queryKey: ['job-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
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
      return data;
    },
    enabled: filters.category !== 'all'
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Type de mission</Label>
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

      <div className="space-y-2">
        <Label>Catégorie</Label>
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

      <div className="space-y-2">
        <Label>Type de contrat</Label>
        <Select
          value={filters.contractType}
          onValueChange={(value) => onFilterChange("contractType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="full-time">Temps plein</SelectItem>
            <SelectItem value="part-time">Temps partiel</SelectItem>
            <SelectItem value="contract">Contrat</SelectItem>
            <SelectItem value="temporary">Temporaire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Mode de travail</Label>
        <Select
          value={filters.remoteType}
          onValueChange={(value) => onFilterChange("remoteType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les modes</SelectItem>
            <SelectItem value="on-site">Sur site</SelectItem>
            <SelectItem value="remote">À distance</SelectItem>
            <SelectItem value="hybrid">Hybride</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}