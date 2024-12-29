import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FilterHeader() {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <SlidersHorizontal className="h-5 w-5 text-victaure-blue" />
      <h3 className="font-semibold">{t("marketplace.filters.title")}</h3>
    </div>
  );
}