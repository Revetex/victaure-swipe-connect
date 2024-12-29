import { Search, SlidersHorizontal, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { JobFilters } from "./JobFilterUtils";
import { missionCategories } from "@/types/job";
import { quebecCities } from "@/data/cities";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
}

export function JobFiltersPanel({ filters, onFilterChange, openLocation, setOpenLocation }: JobFiltersPanelProps) {
  const { t } = useTranslation();
  const subcategories = filters.category !== "all" ? missionCategories[filters.category]?.subcategories : [];

  return (
    <div className="bg-card p-4 rounded-lg space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-5 w-5 text-victaure-blue" />
        <h3 className="font-semibold">{t("marketplace.filters.title")}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            {t("marketplace.filters.search")}
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("marketplace.filters.searchPlaceholder")}
              className="pl-8"
              value={filters.searchTerm}
              onChange={(e) => onFilterChange("searchTerm", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("marketplace.filters.category")}
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("marketplace.filters.allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("marketplace.filters.allCategories")}</SelectItem>
              {Object.keys(missionCategories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filters.category !== "all" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("marketplace.filters.category")}
            </label>
            <Select
              value={filters.subcategory}
              onValueChange={(value) => onFilterChange("subcategory", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("marketplace.filters.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("marketplace.filters.allCategories")}</SelectItem>
                {subcategories?.map((subcat) => (
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
            {t("marketplace.filters.duration")}
          </label>
          <Select
            value={filters.duration}
            onValueChange={(value) => onFilterChange("duration", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("marketplace.filters.allDurations")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("marketplace.filters.allDurations")}</SelectItem>
              <SelectItem value="3-6">3-6 mois</SelectItem>
              <SelectItem value="6-12">6-12 mois</SelectItem>
              <SelectItem value="12+">12+ mois</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("marketplace.filters.experienceLevel")}
          </label>
          <Select
            value={filters.experienceLevel}
            onValueChange={(value) => onFilterChange("experienceLevel", value)}
          >
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

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("marketplace.filters.location")}
          </label>
          <Popover open={openLocation} onOpenChange={setOpenLocation}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openLocation}
                className="w-full justify-between"
              >
                {filters.location
                  ? filters.location
                  : t("marketplace.filters.selectCity")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder={t("marketplace.filters.selectCity")} />
                <CommandEmpty>{t("marketplace.filters.noCity")}</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-auto">
                  {quebecCities.map((city) => (
                    <CommandItem
                      key={city}
                      value={city}
                      onSelect={(currentValue) => {
                        onFilterChange("location", currentValue);
                        setOpenLocation(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.location === city ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {city}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}