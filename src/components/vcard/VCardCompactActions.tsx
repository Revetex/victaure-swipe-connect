import { Button } from "@/components/ui/button";
import { Download, Edit2 } from "lucide-react";

interface VCardCompactActionsProps {
  onExpand: () => void;
  onEdit: () => void;
}

export function VCardCompactActions({ onExpand, onEdit }: VCardCompactActionsProps) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onExpand}
        className="hover:bg-primary/5"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="hover:bg-primary/5"
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Éditer
      </Button>
    </div>
  );
}