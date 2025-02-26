
import { Button } from "@/components/ui/button";
import { Edit2, Save, Trash2 } from "lucide-react";

interface StickyNoteActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export function StickyNoteActions({
  isEditing,
  onEdit,
  onSave,
  onDelete
}: StickyNoteActionsProps) {
  return (
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {isEditing ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSave}
          className="bg-black/5 hover:bg-black/10"
        >
          <Save className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="bg-black/5 hover:bg-black/10"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className="bg-black/5 hover:bg-black/10 hover:text-red-500"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
