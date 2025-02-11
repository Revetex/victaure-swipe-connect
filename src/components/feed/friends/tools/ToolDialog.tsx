
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NotesPage } from "@/components/tools/NotesPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { ChessPage } from "@/components/tools/ChessPage";

interface ToolDialogProps {
  activeTool: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ToolDialog({ activeTool, onOpenChange }: ToolDialogProps) {
  const getToolComponent = () => {
    switch (activeTool) {
      case "Notes":
        return NotesPage;
      case "Tâches":
        return TasksPage;
      case "Calculatrice":
        return CalculatorPage;
      case "Traducteur":
        return TranslatorPage;
      case "Échecs":
        return ChessPage;
      default:
        return null;
    }
  };

  const ToolComponent = getToolComponent();

  return (
    <Dialog open={!!activeTool} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-6">
        {ToolComponent && <ToolComponent />}
      </DialogContent>
    </Dialog>
  );
}
