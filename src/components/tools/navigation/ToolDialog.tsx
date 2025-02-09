
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tool, ToolInfo } from "./types";
import { ToolErrorBoundary } from "../error/ToolErrorBoundary";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ToolDialogProps {
  openTool: Tool | null;
  onClose: () => void;
  activeTool: ToolInfo | undefined;
}

export function ToolDialog({ openTool, onClose, activeTool }: ToolDialogProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!activeTool) return null;
  const ActiveComponent = activeTool.component;

  return (
    <Dialog 
      open={!!openTool} 
      onOpenChange={() => onClose()}
      aria-labelledby="tool-dialog-title"
    >
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0">
        <motion.div 
          className="flex flex-col h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div 
            className="sticky top-0 z-50 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            role="toolbar"
            aria-label="Barre d'outils"
          >
            <DialogTitle id="tool-dialog-title" className="text-lg font-semibold">
              {activeTool.label}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Interface de l'outil {activeTool.label}
            </DialogDescription>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              <ToolErrorBoundary>
                {isLoading && (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {ActiveComponent && (
                  <div 
                    style={{ display: isLoading ? 'none' : 'block' }}
                    role="main"
                    aria-busy={isLoading}
                  >
                    <ActiveComponent onLoad={() => setIsLoading(false)} />
                  </div>
                )}
              </ToolErrorBoundary>
            </div>
          </ScrollArea>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
