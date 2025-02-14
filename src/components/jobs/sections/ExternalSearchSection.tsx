
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { JobFilters } from "../JobFilterUtils";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState } from "react";

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
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  return (
    <div className="w-full p-4 bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recherche externe</h3>
        <Button
          variant="outline"
          onClick={() => setShowPaymentDialog(true)}
          className="gap-2"
        >
          <CreditCard className="h-4 w-4" />
          Paramètres de paiement
        </Button>
      </div>
      
      <GoogleSearchBox />
    </div>
  );
}
