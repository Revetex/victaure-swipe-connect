import { Button } from "@/components/ui/button";
import { ChevronLeft, Palette } from "lucide-react";
import { motion } from "framer-motion";

interface VCardEditingHeaderProps {
  onBack: () => void;
  onCustomize: () => void;
  showCustomization: boolean;
}

export function VCardEditingHeader({
  onBack,
  onCustomize,
  showCustomization,
}: VCardEditingHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-4 pb-4 border-b"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onCustomize}
        className={`gap-2 ${showCustomization ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
      >
        <Palette className="h-4 w-4" />
        Personnaliser
      </Button>
    </motion.div>
  );
}