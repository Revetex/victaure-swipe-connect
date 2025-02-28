
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { tools } from "./ToolsList";

interface ToolDialogProps {
  toolId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ToolDialog({ toolId, isOpen, onClose }: ToolDialogProps) {
  const tool = tools.find((t) => t.id === toolId);

  if (!tool) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={tool.color}>{tool.icon}</span>
            {tool.name}
          </DialogTitle>
          <DialogDescription>
            Utilisez cet outil pour améliorer votre productivité
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Cet outil est actuellement en développement.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
