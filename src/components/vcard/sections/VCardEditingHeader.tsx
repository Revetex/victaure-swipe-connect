import { Button } from "@/components/ui/button";
import { Paintbrush, Save, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface VCardEditingHeaderProps {
  onBack: () => void;
  onCustomize: () => void;
  onSave: () => void;
  isProcessing: boolean;
  showCustomization: boolean;
}

export function VCardEditingHeader({
  onBack,
  onCustomize,
  onSave,
  isProcessing,
  showCustomization
}: VCardEditingHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-4 z-50 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between bg-background/95 backdrop-blur-sm p-4 rounded-lg border shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCustomize}
            className={`gap-2 transition-colors ${
              showCustomization ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <Paintbrush className="h-4 w-4" />
            Personnalisation
          </Button>
          <Button
            onClick={onSave}
            size="sm"
            className="gap-2"
            disabled={isProcessing}
          >
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </div>
    </motion.div>
  );
}