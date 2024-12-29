import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass: string;
  onDelete: (id: number) => void;
}

export function StickyNote({ note, colorClass, onDelete }: StickyNoteProps) {
  return (
    <div className={`p-4 rounded-lg shadow-sm group animate-in slide-in-from-left duration-300 ${colorClass}`}>
      <div className="flex justify-between items-start">
        <p className="flex-1 whitespace-pre-wrap">{note.text}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(note.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive -mt-2 -mr-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}