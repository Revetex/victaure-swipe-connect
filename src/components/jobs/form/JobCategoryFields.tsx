import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { missionCategories } from "@/types/job";

interface JobCategoryFieldsProps {
  category: string;
  subcategory: string;
  onChange: (field: string, value: string) => void;
}

export function JobCategoryFields({
  category,
  subcategory,
  onChange,
}: JobCategoryFieldsProps) {
  const subcategories = category ? missionCategories[category]?.subcategories : [];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={category}
          onValueChange={(value) => {
            onChange("category", value);
            onChange("subcategory", ""); // Reset subcategory when category changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(missionCategories).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {category && subcategories && (
        <div className="space-y-2">
          <Label htmlFor="subcategory">Sous-catégorie</Label>
          <Select
            value={subcategory}
            onValueChange={(value) => onChange("subcategory", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((subcat) => (
                <SelectItem key={subcat} value={subcat}>
                  {subcat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}