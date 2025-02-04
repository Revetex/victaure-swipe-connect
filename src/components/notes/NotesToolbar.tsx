import { Grid, Plus, ArrowLeft, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NotesToolbarProps {
  showGrid: boolean;
  onToggleGrid: () => void;
  onAddNote?: () => void;
  onNavigateLeft?: () => void;
  onNavigateRight?: () => void;
}

export function NotesToolbar({ 
  showGrid, 
  onToggleGrid,
  onAddNote,
  onNavigateLeft,
  onNavigateRight 
}: NotesToolbarProps) {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/");
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
          onClick={onNavigateLeft}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onNavigateRight}
          className="h-9 w-9"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onToggleGrid}
          className="h-9 w-9"
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
      
      <Button
        onClick={onAddNote}
        size="icon"
        className="h-9 w-9 bg-primary hover:bg-primary/90"
      >
        <Plus className="h-4 w-4 text-primary-foreground" />
      </Button>
    </div>
  );
}