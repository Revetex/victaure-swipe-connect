
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tool, ToolInfo } from "./types";

interface ToolDialogProps {
  openTool: Tool | null;
  onClose: () => void;
  activeTool: ToolInfo | undefined;
}

export function ToolDialog({ openTool, onClose, activeTool }: ToolDialogProps) {
  if (!activeTool) return null;
  const ActiveComponent = activeTool.component;

  return (
    <Dialog open={!!openTool} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0">
        <motion.div 
          className="flex flex-col h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="sticky top-0 z-50 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h2 className="text-lg font-semibold">
              {activeTool.label}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </ScrollArea>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
