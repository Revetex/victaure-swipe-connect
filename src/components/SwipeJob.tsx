import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SwipeMatch } from "./SwipeMatch";
import { CreateJobForm } from "./jobs/CreateJobForm";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Offres disponibles</h2>
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
      
      <div className="flex justify-center">
        <SwipeMatch />
      </div>
    </div>
  );
}