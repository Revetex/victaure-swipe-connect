import { Grid, Minus, MoveIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesToolbarProps {
  showGrid: boolean;
  onToggleGrid: () => void;
}

export function NotesToolbar({ showGrid, onToggleGrid }: NotesToolbarProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8" 
        onClick={onToggleGrid}
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8">
        <Minus className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8">
        <MoveIcon className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}