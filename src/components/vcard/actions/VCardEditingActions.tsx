import { Save } from "lucide-react";
import { VCardActionButton } from "./VCardActionButton";
import { toast } from "sonner";

interface VCardEditingActionsProps {
  onSave: () => void;
}

export function VCardEditingActions({ onSave }: VCardEditingActionsProps) {
  const handleSave = async () => {
    try {
      await onSave();
      toast.success("Profil sauvegardé avec succès");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Erreur lors de la sauvegarde du profil");
    }
  };

  return (
    <div className="flex-1 min-w-[120px]">
      <VCardActionButton
        icon={Save}
        label="Sauvegarder"
        onClick={handleSave}
        className="w-full"
      />
    </div>
  );
}