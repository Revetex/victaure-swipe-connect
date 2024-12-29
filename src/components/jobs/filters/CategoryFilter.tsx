import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { missionCategories } from "@/types/job";

interface CategoryFilterProps {
  category: string;
  subcategory: string;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

export function CategoryFilter({
  category,
  subcategory,
  onCategoryChange,
  onSubcategoryChange,
}: CategoryFilterProps) {
  const { t } = useTranslation();
  const subcategories = category !== "all" ? missionCategories[category]?.subcategories : [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("marketplace.filters.category")}
        </label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("marketplace.filters.allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("marketplace.filters.allCategories")}</SelectItem>
            {Object.keys(missionCategories).map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {category !== "all" && subcategories && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("marketplace.filters.subcategory")}
          </label>
          <Select value={subcategory} onValueChange={onSubcategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("marketplace.filters.allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("marketplace.filters.allCategories")}</SelectItem>
              {subcategories.map((subcat) => (
                <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}