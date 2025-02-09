
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RefreshCw, Search, MapPin, Briefcase, Clock, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobFilters as JobFiltersType, defaultFilters } from "./JobFilterUtils";
import { SearchFilter } from "./filters/SearchFilter";
import { CategoryFilters } from "./filters/CategoryFilters";
import { LocationFilter } from "./filters/LocationFilter";
import { ExperienceFilter } from "./filters/ExperienceFilter";
import { BudgetFilter } from "./filters/BudgetFilter";
import { DateFilters } from "./filters/DateFilters";
import { WorkTypeFilters } from "./filters/WorkTypeFilters";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (key: keyof JobFiltersType, value: any) => void;
}

export function JobFilters({
  filters,
  onFilterChange,
}: JobFiltersProps) {
  const isMobile = useIsMobile();

  const resetFilters = () => {
    Object.keys(defaultFilters).forEach((key) => {
      onFilterChange(key as keyof JobFiltersType, defaultFilters[key as keyof JobFiltersType]);
    });
    toast.success("Filtres réinitialisés");
  };

  const filterSections = [
    {
      icon: Search,
      title: "Recherche",
      component: SearchFilter,
    },
    {
      icon: Briefcase,
      title: "Catégories",
      component: CategoryFilters,
    },
    {
      icon: MapPin,
      title: "Localisation",
      component: LocationFilter,
    },
    {
      icon: Clock,
      title: "Expérience",
      component: ExperienceFilter,
    },
    {
      icon: Calendar,
      title: "Date",
      component: DateFilters,
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Filtres</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      {filterSections.map((section, index) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <section.icon className="h-4 w-4 text-primary" />
              {section.title}
            </div>
            <section.component 
              filters={filters}
              onFilterChange={onFilterChange}
            />
          </div>
          {index < filterSections.length - 1 && (
            <Separator className="my-4 bg-border/50" />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
