import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FilterHeader() {
  const { t } = useTranslation("jobs");
  
  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="h-5 w-5 text-victaure-blue" />
      <h3 className="font-semibold text-lg">{t("filters.title")}</h3>
    </div>
  );
}