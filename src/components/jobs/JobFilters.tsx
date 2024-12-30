import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { provinceData } from "@/data/provinces";

interface JobFiltersProps {
  category: string;
  setCategory: (category: string) => void;
  subcategory: string;
  setSubcategory: (subcategory: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  salaryRange: number[];
  setSalaryRange: (range: number[]) => void;
  missionCategories: Record<string, { icon: any; subcategories: string[] }>;
}

export function JobFilters({
  category,
  setCategory,
  subcategory,
  setSubcategory,
  duration,
  setDuration,
  salaryRange,
  setSalaryRange,
  missionCategories,
}: JobFiltersProps) {
  const isMobile = useIsMobile();
  const subcategories = category ? missionCategories[category]?.subcategories : [];

  return (
    <div className={`lg:col-span-1 space-y-6 bg-card p-4 sm:p-6 rounded-lg shadow-sm border ${
      isMobile ? "sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm" : ""
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-5 w-5 text-victaure-blue" />
        <h3 className="font-semibold">Filtres</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Catégorie
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {Object.keys(missionCategories).map((cat) => {
                const CategoryIcon = missionCategories[cat].icon;
                return (
                  <SelectItem key={cat} value={cat}>
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-4 w-4" />
                      <span>{cat}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {category && subcategories && category !== "all" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Sous-catégorie
            </label>
            <Select value={subcategory} onValueChange={setSubcategory}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les sous-catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sous-catégories</SelectItem>
                {subcategories.map((subcat) => (
                  <SelectItem key={subcat} value={subcat}>
                    {subcat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Durée
          </label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les durées" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les durées</SelectItem>
              {["3-6 mois", "6-12 mois", "12+ mois"].map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-4">
            Rémunération (CAD/jour)
          </label>
          <Slider
            defaultValue={salaryRange}
            max={1000}
            min={300}
            step={50}
            onValueChange={setSalaryRange}
            className="mt-2"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{salaryRange[0]} CAD</span>
            <span>{salaryRange[1]} CAD</span>
          </div>
        </div>
      </div>
    </div>
  );
}