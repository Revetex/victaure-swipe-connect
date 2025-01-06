import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryIcon } from "@/components/skills/CategoryIcon";
import { missionCategories } from "@/types/categories";

interface JobCategoryFieldsProps {
  category?: string;
  onChange?: (values: { [key: string]: any }) => void;
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
                  onChange?.({ category: value, subcategory: null });
                }}
                value={field.value || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[300px]">
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
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onChange?.({ subcategory: value });
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {missionCategories[selectedCategory as keyof typeof missionCategories]?.subcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
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