import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorOption } from "@/types/todo";

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
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Input
        value={newNote}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Nouvelle note..."
        className="glass-card flex-1 min-w-0"
        onKeyPress={(e) => e.key === 'Enter' && onAdd()}
      />
      <div className="flex gap-2 sm:w-auto w-full">
        <Select onValueChange={onColorChange} defaultValue={selectedColor}>
          <SelectTrigger className="w-[120px] glass-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem 
                key={color.value} 
                value={color.value}
                className={`${color.class} ${getTextColor(color.class)} rounded-md`}
              >
                {color.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={onAdd}
          size="icon"
          variant="outline"
          className="glass-card hover:bg-primary hover:text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}