import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const categories = [
  "Technology",
  "Design",
  "Marketing",
  "Business",
  "Writing",
  "Customer Service",
  "Other"
];

const subcategories: Record<string, string[]> = {
  Technology: ["Web Development", "Mobile Development", "Data Science", "DevOps", "Other"],
  Design: ["UI/UX", "Graphic Design", "Product Design", "Other"],
  Marketing: ["Digital Marketing", "Content Marketing", "Social Media", "SEO", "Other"],
  Business: ["Consulting", "Project Management", "Sales", "Other"],
  Writing: ["Technical Writing", "Copywriting", "Content Writing", "Other"],
  "Customer Service": ["Support", "Account Management", "Other"],
  Other: ["Other"]
};

export interface JobCategoryFieldsProps {
  category: string;
  subcategory?: string;
  onChange: (values: { [key: string]: string }) => void;
}

export function JobCategoryFields({ category, subcategory, onChange }: JobCategoryFieldsProps) {
  const { control, watch } = useFormContext();
  const selectedCategory = watch("category");

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catégorie</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedCategory && (
        <FormField
          control={control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sous-catégorie</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories[selectedCategory]?.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
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