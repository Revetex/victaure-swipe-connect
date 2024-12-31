import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface JobCategoryFieldsProps {
  category: string;
  onChange: (values: { [key: string]: any }) => void;
}

export function JobCategoryFields({ category, onChange }: JobCategoryFieldsProps) {
  const { control, watch } = useFormContext();
  const missionType = watch("mission_type");

  // Fetch categories from the database
  const { data: categories = [], isError: isCategoriesError } = useQuery({
    queryKey: ["jobCategories", missionType],
    queryFn: async () => {
      console.log("Fetching categories for mission type:", missionType);
      const query = supabase
        .from('job_categories')
        .select('*')
        .order('name');
      
      if (missionType !== "all") {
        query.eq('mission_type', missionType);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      console.log("Fetched categories:", data);
      return data || [];
    },
  });

  // Fetch subcategories when a category is selected
  const { data: subcategories = [], isError: isSubcategoriesError } = useQuery({
    queryKey: ["jobSubcategories", category],
    queryFn: async () => {
      if (!category || category === "all") return [];

      console.log("Fetching subcategories for category:", category);
      const { data, error } = await supabase
        .from('job_subcategories')
        .select('*')
        .eq('category_id', category)
        .order('name');

      if (error) {
        console.error("Error fetching subcategories:", error);
        throw error;
      }
      console.log("Fetched subcategories:", data);
      return data || [];
    },
    enabled: !!category && category !== "all",
  });

  if (isCategoriesError) {
    console.error("Error loading categories");
    return <div>Erreur lors du chargement des catégories</div>;
  }

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
                  onChange({ category: value, subcategory: null });
                }}
                value={field.value || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {category && subcategories.length > 0 && (
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
                    onChange({ subcategory: value });
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcat) => (
                      <SelectItem key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </SelectItem>
                    ))}
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