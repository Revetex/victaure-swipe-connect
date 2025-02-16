
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Building2 } from "lucide-react";

interface JobHeaderProps {
  onSearch: (value: string) => void;
  totalJobs: number;
}

export function JobHeader({ onSearch, totalJobs }: JobHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offres d'emploi</h1>
          <p className="text-muted-foreground">
            {totalJobs} offres d'emploi disponibles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            Par lieu
          </Button>
          <Button variant="outline" className="gap-2">
            <Building2 className="h-4 w-4" />
            Par entreprise
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un emploi..."
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
