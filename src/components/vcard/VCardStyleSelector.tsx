import { Button } from "@/components/ui/button";
import { StyleOption } from "./types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { styleOptions } from "./styles";
import { toast } from "sonner";

interface VCardStyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => Promise<void>;
  isEditing: boolean;
}

export function VCardStyleSelector({
  selectedStyle,
  onStyleSelect,
  isEditing
}: VCardStyleSelectorProps) {
  if (!isEditing) return null;

  const handleStyleSelect = async (style: StyleOption) => {
    try {
      await onStyleSelect(style);
      toast.success(`Style ${style.name} appliqué avec succès`);
    } catch (error) {
      console.error('Error updating style:', error);
      toast.error("Erreur lors de l'application du style");
    }
  };

  return (
    <div className="space-y-4 fade-in">
      <h3 className="text-lg font-semibold text-white/90">Style</h3>
      <div className="responsive-grid">
        {styleOptions.map((style) => (
          <motion.div
            key={style.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => handleStyleSelect(style)}
              className={cn(
                "relative w-full h-16 rounded-xl transition-all duration-300 overflow-hidden group",
                selectedStyle.id === style.id 
                  ? 'ring-2 ring-white shadow-lg scale-105' 
                  : 'hover:ring-1 hover:ring-white/50'
              )}
              style={{ 
                background: `linear-gradient(135deg, ${style.color}, ${style.secondaryColor})`,
                fontFamily: style.font
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
              <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
                <span className="text-white text-sm font-medium">
                  {style.name}
                </span>
                {selectedStyle.id === style.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}