import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { cn } from "@/lib/utils";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass: string;
  onDelete: (id: number) => void;
}

export function StickyNote({ note, colorClass, onDelete }: StickyNoteProps) {
  // Function to determine text color based on background color
  const getTextColor = (colorClass: string) => {
    switch (colorClass) {
      case "bg-yellow-100":
      case "bg-green-100":
      case "bg-blue-100":
      case "bg-pink-100":
        return "text-gray-900"; // Dark text for light backgrounds
      case "bg-purple-600":
      case "bg-blue-600":
      case "bg-indigo-600":
        return "text-white"; // Light text for dark backgrounds
      default:
        return "text-gray-900"; // Default to dark text
    }
  };

  return (
    <div className={cn(
      "p-4 rounded-lg shadow-sm group transition-all duration-200",
      "hover:shadow hover:scale-[1.02]",
      "animate-in slide-in-from-left",
      colorClass,
      getTextColor(colorClass)
    )}>
      <div className="flex justify-between items-start gap-2">
        <p className="flex-1 whitespace-pre-wrap text-sm">{note.text}</p>
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