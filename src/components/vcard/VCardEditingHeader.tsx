import { Button } from "@/components/ui/button";
import { ChevronLeft, Palette, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface VCardEditingHeaderProps {
  onBack: () => void;
  onCustomize: () => void;
  onSave?: () => void;
  showCustomization: boolean;
  isProcessing?: boolean;
}

export function VCardEditingHeader({
  onBack,
  onCustomize,
  onSave,
  showCustomization,
  isProcessing
}: VCardEditingHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-4 pb-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10"
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size={isMobile ? "icon" : "sm"}
          onClick={onBack}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {!isMobile && "Retour"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {onSave && (
          <Button
            variant="default"
            size={isMobile ? "icon" : "sm"}
            onClick={onSave}
            disabled={isProcessing}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {!isMobile && "Sauvegarder"}
          </Button>
        )}
        
        <Button
          variant={showCustomization ? "default" : "outline"}
          size={isMobile ? "icon" : "sm"}
          onClick={onCustomize}
          className="gap-2"
        >
          <Palette className="h-4 w-4" />
          {!isMobile && "Personnaliser"}
        </Button>
      </div>
    </motion.div>
  );
}