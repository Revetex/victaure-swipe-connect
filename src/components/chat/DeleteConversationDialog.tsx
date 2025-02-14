
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConversationDialogProps {
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
}

export function DeleteConversationDialog({ onConfirm, onCancel }: DeleteConversationDialogProps) {
  const handleDelete = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      if (typeof document !== 'undefined') {
        const dialog = document.querySelector('dialog');
        if (dialog) dialog.close();
      }
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
          onClick={onCancel}
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
