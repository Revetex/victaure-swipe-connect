import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryIcon } from "@/components/skills/CategoryIcon";
import { missionCategories } from "@/types/categories";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface JobCategoryFieldsProps {
  category?: string;
  onChange?: (values: { [key: string]: any }) => void;
}

export function JobCategoryFields({ category, onChange }: JobCategoryFieldsProps) {
  const { control, watch } = useFormContext();
  const missionType = watch("mission_type");
  const selectedCategory = watch("category");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['job-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        toast.error("Erreur lors du chargement des catégories");
        throw error;
      }

      return data;
    }
  });

  // Fetch subcategories based on selected category
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['job-subcategories', selectedCategoryId],
    enabled: !!selectedCategoryId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_subcategories')
        .select('*')
        .eq('category_id', selectedCategoryId)
        .order('name', { ascending: true });

      if (error) {
        toast.error("Erreur lors du chargement des sous-catégories");
        throw error;
      }

      return data;
    }
  });

  const handleCategoryChange = async (categoryName: string) => {
    try {
      const { data, error } = await supabase
        .from('job_categories')
        .select('id')
        .eq('name', categoryName)
        .single();

      if (error) throw error;

      setSelectedCategoryId(data.id);
      onChange?.({ category: categoryName, subcategory: null });
    } catch (error) {
      console.error('Error fetching category ID:', error);
      toast.error("Erreur lors de la sélection de la catégorie");
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catégorie</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCategoryChange(value);
                }}
                value={field.value || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[300px]">
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.name} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={category.name} />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedCategory && selectedCategoryId && (
        <FormField
          control={control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sous-catégorie</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onChange?.({ subcategory: value });
                  }}
                  value={field.value || ""}
                  disabled={subcategoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {subcategories?.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.name}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}