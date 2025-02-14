
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteConversationDialogProps {
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
}

export function DeleteConversationDialog({ onConfirm, onCancel }: DeleteConversationDialogProps) {
  const handleDelete = async () => {
    try {
      await onConfirm();
      toast.success("Conversation supprimée avec succès");
      if (typeof document !== 'undefined') {
        document.querySelector('dialog')?.close();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Supprimer la conversation</DialogTitle>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex gap-2 mt-4">
        <Button 
          variant="ghost" 
          onClick={() => {
            onCancel?.();
            if (typeof document !== 'undefined') {
              document.querySelector('dialog')?.close();
            }
          }}
        >
          Annuler
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
        >
          Supprimer
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
