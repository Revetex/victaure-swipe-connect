import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, Grid } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotesToolbarProps {
  onAddNote?: () => void;
  onDeleteSelected?: () => void;
  hasSelectedNotes?: boolean;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  onNavigateLeft?: () => void;
  onNavigateRight?: () => void;
}

export function NotesToolbar({
  onAddNote,
  onDeleteSelected,
  hasSelectedNotes = false,
  showGrid = true,
  onToggleGrid,
  onNavigateLeft,
  onNavigateRight
}: NotesToolbarProps) {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/dashboard");
    console.log("Navigating to dashboard...");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleReturn}
          className="h-9 w-9"
          title="Return to Dashboard"
        >
          <LayoutDashboard className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onAddNote}
          className="h-9 w-9"
        >
          <Plus className="h-4 w-4" />
        </Button>
        {onToggleGrid && (
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleGrid}
            className={`h-9 w-9 ${showGrid ? 'bg-accent' : ''}`}
          >
            <Grid className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {onNavigateLeft && (
          <Button
            variant="outline"
            size="icon"
            onClick={onNavigateLeft}
            className="h-9 w-9"
          >
            ←
          </Button>
        )}
        {onNavigateRight && (
          <Button
            variant="outline"
            size="icon"
            onClick={onNavigateRight}
            className="h-9 w-9"
          >
            →
          </Button>
        )}
        {hasSelectedNotes && (
          <Button
            variant="destructive"
            size="icon"
            onClick={onDeleteSelected}
            className="h-9 w-9"
          >
            <span className="sr-only">Delete selected notes</span>
            🗑️
          </Button>
        )}
      </div>
    </div>
  );
}