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
    <div className={`lg:col-span-1 bg-card rounded-lg shadow-sm border ${
      isMobile ? "sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm" : ""
    }`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Filtres</h3>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Category Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Catégorie</h4>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
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

          {/* Subcategory Section - Only show if category is selected */}
          {category && subcategories && category !== "all" && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Sous-catégorie</h4>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger className="w-full">
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

          {/* Duration Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Durée</h4>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-full">
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

          {/* Salary Range Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">
              Rémunération (CAD/jour)
            </h4>
            <Slider
              defaultValue={salaryRange}
              max={1000}
              min={300}
              step={50}
              onValueChange={setSalaryRange}
              className="mt-6"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{salaryRange[0]} CAD</span>
              <span>{salaryRange[1]} CAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}