import { Button } from "@/components/ui/button";
import { StyleOption } from "./types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface VCardStyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => Promise<void>;
  isEditing: boolean;
  styleOptions: StyleOption[];
}

export function VCardStyleSelector({
  selectedStyle,
  onStyleSelect,
  isEditing,
  styleOptions,
}: VCardStyleSelectorProps) {
  if (!isEditing) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground/90">Style</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
              onClick={() => onStyleSelect(style)}
              className={cn(
                "relative w-full h-16 rounded-xl transition-all duration-300 overflow-hidden group",
                selectedStyle.id === style.id 
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : 'hover:ring-1 hover:ring-primary/50'
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