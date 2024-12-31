import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { cn } from "@/lib/utils";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass: string;
  onDelete: (id: string) => void;
}

export function StickyNote({ note, colorClass, onDelete }: StickyNoteProps) {
  // Function to determine text color based on background color
  const getTextColor = (bgColorClass: string) => {
    switch (bgColorClass) {
      case "bg-[#FEF7CD]": // Yellow
      case "bg-[#F2FCE2]": // Green
      case "bg-[#D3E4FD]": // Blue
      case "bg-[#E5DEFF]": // Purple
      case "bg-[#FFDEE2]": // Pink
      case "bg-[#FDE1D3]": // Orange
      case "bg-[#F1F0FB]": // Gray
        return "text-gray-800";
      default:
        return "text-gray-900";
    }
  };

  const textColorClass = getTextColor(colorClass);

  return (
    <div className={cn(
      "p-4 rounded-lg shadow-sm group transition-all duration-200",
      "hover:shadow hover:scale-[1.02]",
      "animate-in slide-in-from-left",
      colorClass
    )}>
      <div className="flex justify-between items-start gap-2">
        <p className={cn(
          "flex-1 whitespace-pre-wrap text-sm",
          textColorClass,
          "font-medium"
        )}>
          {note.text}
        </p>
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