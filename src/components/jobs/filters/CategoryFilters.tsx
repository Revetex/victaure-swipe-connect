import { JobFilters } from "../JobFilterUtils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategoryFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function CategoryFilters({ filters, onFilterChange }: CategoryFiltersProps) {
  const isMobile = useIsMobile();
  const categories = [
    "Technologie",
    "Marketing",
    "Design",
    "Ventes",
    "Service client",
    "Administration",
    "Finance",
    "Ressources humaines",
    "Autre"
  ];

  const renderCategories = () => (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-2">
        {categories.map((category) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant={filters.category === category ? "default" : "outline"}
              className={`w-full justify-start gap-2 ${
                filters.category === category 
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/5"
              }`}
              onClick={() => onFilterChange("category", category)}
            >
              {filters.category === category && (
                <Check className="h-4 w-4 shrink-0" />
              )}
              <span className="truncate">{category}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Catégorie: {filters.category || "Toutes"}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Choisir une catégorie</SheetTitle>
            <SheetDescription>
              Sélectionnez la catégorie d'emploi qui vous intéresse
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            {renderCategories()}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return renderCategories();
}