import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExperienceFilterProps {
  experienceLevel: string;
  onExperienceLevelChange: (value: string) => void;
}

export function ExperienceFilter({
  experienceLevel,
  onExperienceLevelChange,
}: ExperienceFilterProps) {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {t("marketplace.filters.experienceLevel")}
      </label>
      <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("marketplace.filters.allLevels")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("marketplace.filters.allLevels")}</SelectItem>
          <SelectItem value="Junior">Junior</SelectItem>
          <SelectItem value="Mid-Level">Intermédiaire</SelectItem>
          <SelectItem value="Senior">Senior</SelectItem>
          <SelectItem value="Expert">Expert</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}