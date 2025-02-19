
import { MapPin, Building2, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

interface JobsFiltersProps {
  selectedLocation: string;
  selectedCompanyType: string;
  sortOrder: "recent" | "salary";
  locations: string[];
  onLocationChange: (location: string) => void;
  onCompanyTypeChange: (type: string) => void;
  onSortOrderChange: (order: "recent" | "salary") => void;
}

export function JobsFilters({
  selectedLocation,
  selectedCompanyType,
  sortOrder,
  locations,
  onLocationChange,
  onCompanyTypeChange,
  onSortOrderChange
}: JobsFiltersProps) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm text-muted-foreground"
          >
            <option value="">Toutes les localisations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCompanyType}
            onChange={(e) => onCompanyTypeChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm text-muted-foreground"
          >
            <option value="">Tous les types d'entreprises</option>
            <option value="internal">Entreprises Victaure</option>
            <option value="external">Entreprises externes</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as "recent" | "salary")}
            className="bg-transparent border-none focus:ring-0 text-sm text-muted-foreground"
          >
            <option value="recent">Plus récents</option>
            <option value="salary">Meilleurs salaires</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
