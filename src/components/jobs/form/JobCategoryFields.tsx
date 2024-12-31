import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const categories = {
  company: [
    "technology",
    "design",
    "writing",
    "translation",
    "marketing",
    "business",
    "legal",
    "admin",
    "customer_service",
    "other"
  ],
  individual: [
    "home_improvement",
    "gardening",
    "cleaning",
    "moving",
    "tutoring",
    "personal_assistance",
    "events",
    "repairs",
    "other"
  ]
};

const subcategories = {
  technology: ["Web Development", "Mobile Development", "DevOps", "Data Science"],
  design: ["UI/UX", "Graphic Design", "Product Design", "Brand Design"],
  home_improvement: ["Painting", "Plumbing", "Electrical", "Carpentry"],
  gardening: ["Maintenance", "Landscaping", "Tree Service", "Lawn Care"],
  // ... add other subcategories as needed
};

interface JobCategoryFieldsProps {
  category: string;
  onChange: (values: { [key: string]: any }) => void;
}

export function JobCategoryFields({ category, onChange }: JobCategoryFieldsProps) {
  const { control, watch } = useFormContext();
  const missionType = watch("mission_type");
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
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onChange({ category: value, subcategory: null });
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories[missionType as keyof typeof categories].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedCategory && subcategories[selectedCategory as keyof typeof subcategories] && (
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
                    {subcategories[selectedCategory as keyof typeof subcategories].map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
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