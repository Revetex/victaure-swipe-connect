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
  const { t } = useTranslation("jobs");

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {t("filters.experienceLevel")}
      </label>
      <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("filters.allLevels")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.allLevels")}</SelectItem>
          <SelectItem value="Junior">Junior</SelectItem>
          <SelectItem value="Mid-Level">Intermédiaire</SelectItem>
          <SelectItem value="Senior">Senior</SelectItem>
          <SelectItem value="Expert">Expert</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}