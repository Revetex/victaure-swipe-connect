import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { SwipeMatch } from "./SwipeMatch";
import { CreateJobForm } from "./jobs/CreateJobForm";
import { JobFilters } from "./jobs/JobFilterUtils";
import { JobFiltersPanel } from "./jobs/JobFiltersPanel";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    category: "all",
    subcategory: "all",
    duration: "all",
    experienceLevel: "all",
    location: "",
    searchTerm: ""
  });
  const [openLocation, setOpenLocation] = useState(false);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    if (key === "category" && value !== filters.category) {
      setFilters(prev => ({ ...prev, [key]: value, subcategory: "all" }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Offres disponibles</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-victaure-blue hover:bg-victaure-blue/90 text-white" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une mission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-victaure-blue">
                Ajouter une mission
              </DialogTitle>
              <DialogDescription className="text-victaure-gray-dark">
                Créez une nouvelle mission en remplissant les informations ci-dessous.
                Les professionnels pourront la consulter et y postuler.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <CreateJobForm onSuccess={() => setIsOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <JobFiltersPanel 
        filters={filters}
        onFilterChange={handleFilterChange}
        openLocation={openLocation}
        setOpenLocation={setOpenLocation}
      />
      
      <div className="flex justify-center">
        <SwipeMatch filters={filters} />
      </div>
    </div>
  );
}