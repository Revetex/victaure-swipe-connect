
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { JobFilters } from "../JobFilterUtils";

interface ExternalSearchSectionProps {
  queryString: string;
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function ExternalSearchSection({ 
  queryString,
  filters,
  onFilterChange 
}: ExternalSearchSectionProps) {
  return (
    <div className="w-full p-4 bg-background/60 backdrop-blur-sm rounded-lg border border-border/50">
      <GoogleSearchBox />
    </div>
  );
}
