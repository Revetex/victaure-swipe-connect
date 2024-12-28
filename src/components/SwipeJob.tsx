import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SwipeMatch } from "./SwipeMatch";
import { CreateJobForm } from "./jobs/CreateJobForm";
import { JobFilters } from "./jobs/JobFilters";
import { missionCategories } from "@/types/job";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [duration, setDuration] = useState("");
  const [salaryRange, setSalaryRange] = useState([300, 1000]);

  const handleSearch = () => {
    // Implement search logic here if needed
    console.log("Searching with filters:", { category, subcategory, duration, salaryRange });
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Offres disponibles</h2>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtres de recherche</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <JobFilters
                  category={category}
                  setCategory={setCategory}
                  subcategory={subcategory}
                  setSubcategory={setSubcategory}
                  duration={duration}
                  setDuration={setDuration}
                  salaryRange={salaryRange}
                  setSalaryRange={setSalaryRange}
                  missionCategories={missionCategories}
                />
                <Button 
                  className="w-full mt-4"
                  onClick={handleSearch}
                >
                  Rechercher
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="button-enhanced" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une offre
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle offre</DialogTitle>
              </DialogHeader>
              <CreateJobForm onSuccess={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex justify-center">
        <SwipeMatch filters={{ category, subcategory, duration, salaryRange }} />
      </div>
    </div>
  );
}