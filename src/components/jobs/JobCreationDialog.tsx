import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateJobForm } from "./CreateJobForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JobCreationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function JobCreationDialog({ isOpen, setIsOpen, onSuccess }: JobCreationDialogProps) {
  const handleCreateJob = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour créer une mission");
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-victaure-blue hover:bg-victaure-blue/90 text-white" 
          size="sm"
          onClick={handleCreateJob}
        >
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
          <CreateJobForm onSuccess={() => {
            setIsOpen(false);
            onSuccess();
            toast.success("Mission créée avec succès");
          }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}