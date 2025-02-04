import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorOption } from "@/types/todo";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";

interface NotesInputProps {
  newNote: string;
  selectedColor: string;
  colors: ColorOption[];
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAdd: () => void;
}

export function NotesInput({
  newNote,
  selectedColor,
  colors,
  onNoteChange,
  onColorChange,
  onAdd,
}: NotesInputProps) {
  const isMobile = useIsMobile();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAdd();
    }
  };

  const getColorStyle = (color: string) => {
    switch (color) {
      case "yellow":
        return "bg-[#FEF7CD]";
      case "blue":
        return "bg-[#D3E4FD]";
      case "green":
        return "bg-[#F2FCE2]";
      case "pink":
        return "bg-[#FFDEE2]";
      case "purple":
        return "bg-[#E5DEFF]";
      case "orange":
        return "bg-[#FEC6A1]";
      default:
        return "bg-[#FEF7CD]";
    }
  };

  return (
    <div className={cn(
      "flex gap-2 w-full",
      isMobile ? "flex-col" : "flex-row items-start"
    )}>
      <div className="flex-1 min-w-0">
        <Textarea
          value={newNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Nouvelle note..."
          className={cn(
            "flex-1 min-w-0 bg-background/50 text-foreground resize-none",
            "min-h-[100px]",
            isMobile ? "h-[120px]" : "h-[100px]"
          )}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className={cn(
        "flex gap-2",
        isMobile ? "w-full justify-between" : "flex-col"
      )}>
        <Select onValueChange={onColorChange} value={selectedColor}>
          <SelectTrigger className={cn(
            isMobile ? "w-[120px]" : "w-[100px]",
            getColorStyle(selectedColor),
            "border border-border/10"
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem 
                key={color.value} 
                value={color.value}
                className={cn(
                  "flex items-center gap-2",
                  "cursor-pointer",
                  "transition-colors"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  getColorStyle(color.value)
                )} />
                {color.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={onAdd} 
          size={isMobile ? "default" : "icon"}
          variant="outline"
          className={cn(
            "hover:bg-primary hover:text-primary-foreground transition-colors",
            isMobile ? "flex-1" : "w-[100px] h-[100px]"
          )}
        >
          <Plus className={cn(
            "h-4 w-4",
            isMobile ? "mr-2" : "h-6 w-6"
          )} />
          {isMobile && "Ajouter"}
        </Button>
      </div>
    </div>
  );
}