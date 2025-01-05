import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { JobFilters } from "@/types/filters";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function DateFilters({ filters, onFilterChange }: DateFiltersProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-foreground">Dates</h4>
      
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Créé après</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.createdAfter ? 
                format(new Date(filters.createdAfter), 'PP', { locale: fr }) : 
                'Sélectionner une date'
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.createdAfter ? new Date(filters.createdAfter) : undefined}
              onSelect={(date) => onFilterChange("createdAfter", date?.toISOString() || null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Créé avant</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.createdBefore ? 
                format(new Date(filters.createdBefore), 'PP', { locale: fr }) : 
                'Sélectionner une date'
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.createdBefore ? new Date(filters.createdBefore) : undefined}
              onSelect={(date) => onFilterChange("createdBefore", date?.toISOString() || null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Date limite</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.deadlineBefore ? 
                format(new Date(filters.deadlineBefore), 'PP', { locale: fr }) : 
                'Sélectionner une date'
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.deadlineBefore ? new Date(filters.deadlineBefore) : undefined}
              onSelect={(date) => onFilterChange("deadlineBefore", date?.toISOString() || null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}