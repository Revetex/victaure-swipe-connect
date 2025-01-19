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
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700" 
          size="sm"
          onClick={handleCreateJob}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une mission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Ajouter une mission
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Créez une nouvelle mission en quelques étapes simples
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-2">
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