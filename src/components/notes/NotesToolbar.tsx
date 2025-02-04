import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotesToolbarProps {
  onAddNote?: () => void;
  onDeleteSelected?: () => void;
  hasSelectedNotes: boolean;
}

export function NotesToolbar({
  onAddNote,
  onDeleteSelected,
  hasSelectedNotes
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
      </div>
      
      {hasSelectedNotes && (
        <Button
          variant="destructive"
          size="icon"
          onClick={onDeleteSelected}
          className="h-9 w-9"
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}