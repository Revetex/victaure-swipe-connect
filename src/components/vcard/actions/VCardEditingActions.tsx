import { Save } from "lucide-react";
import { VCardActionButton } from "./VCardActionButton";

interface VCardEditingActionsProps {
  onSave: () => void;
}

export function VCardEditingActions({ onSave }: VCardEditingActionsProps) {
  return (
    <div className="flex-1 min-w-[120px]">
      <VCardActionButton
        icon={Save}
        label="Sauvegarder"
        onClick={onSave}
        className="w-full"
      />
    </div>
  );
}