
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
}

export function DeleteConversationDialog({ onConfirm }: DeleteConversationDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Supprimer la conversation</DialogTitle>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex gap-2 mt-4">
        <Button variant="ghost" onClick={() => document.querySelector('dialog')?.close()}>
          Annuler
        </Button>
        <Button 
          variant="destructive" 
          onClick={async () => {
            await onConfirm();
            document.querySelector('dialog')?.close();
          }}
        >
          Supprimer
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
