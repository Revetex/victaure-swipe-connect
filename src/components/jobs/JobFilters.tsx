import { missionCategories } from "@/types/job";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobFiltersProps {
  category: string;
  setCategory: (value: string) => void;
  subcategory: string;
  setSubcategory: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  missionCategories: typeof missionCategories;
}

export function JobFilters({
  category,
  setCategory,
  subcategory,
  setSubcategory,
  duration,
  setDuration,
  missionCategories,
}: JobFiltersProps) {
  const subcategories = category !== "all" ? missionCategories[category]?.subcategories : [];

  return (
    <div className="space-y-6 lg:sticky lg:top-4">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Catégorie</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {Object.keys(missionCategories).map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {category !== "all" && (
          <div>
            <label className="text-sm font-medium mb-2 block">Sous-catégorie</label>
            <Select value={subcategory} onValueChange={setSubcategory}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les sous-catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sous-catégories</SelectItem>
                {subcategories?.map((subcat) => (
                  <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-2 block">Type de contrat</label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Full-time">Temps plein</SelectItem>
              <SelectItem value="Part-time">Temps partiel</SelectItem>
              <SelectItem value="Contract">Contrat</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}