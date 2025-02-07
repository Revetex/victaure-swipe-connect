
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { tools } from "./ToolsList";
import { NotesPage } from "@/components/tools/NotesPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { ChessPage } from "@/components/tools/ChessPage";

interface ToolDialogProps {
  activeTool: string | null;
  onClose: () => void;
}

const toolComponents = {
  Notes: NotesPage,
  Tâches: TasksPage,
  Calculatrice: CalculatorPage,
  Traducteur: TranslatorPage,
  Convertisseur: () => (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Convertisseur (Bientôt disponible)</p>
    </div>
  ),
  Échecs: ChessPage
};

export function ToolDialog({ activeTool, onClose }: ToolDialogProps) {
  const activeTool_ = tools.find(tool => tool.name === activeTool);
  const ActiveComponent = activeTool ? toolComponents[activeTool as keyof typeof toolComponents] : null;

  return (
    <Dialog open={!!activeTool} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0 bg-background/95 backdrop-blur-xl border-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex flex-col h-full"
        >
          <div className="flex items-center justify-between p-4 border-b bg-background/50">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {activeTool_?.name}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted transition-colors duration-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
