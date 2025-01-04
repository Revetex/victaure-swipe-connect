import { Button } from "@/components/ui/button";
import { StyleOption } from "./types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface VCardStyleSelectorMinimalProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => void;
  styleOptions: StyleOption[];
}

export function VCardStyleSelectorMinimal({
  selectedStyle,
  onStyleSelect,
  styleOptions,
}: VCardStyleSelectorMinimalProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white/90">Style</h3>
      <div className="flex flex-wrap gap-2">
        {styleOptions.map((style) => (
          <motion.div
            key={style.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => onStyleSelect(style)}
              className={`relative h-8 px-3 rounded-full transition-all duration-300 ${
                selectedStyle.id === style.id 
                ? 'ring-2 ring-white shadow-lg' 
                : 'hover:ring-1 hover:ring-white/50'
              }`}
              style={{ 
                background: `linear-gradient(135deg, ${style.color}, ${style.secondaryColor})`,
              }}
            >
              <span className="text-white text-sm font-medium">
                {style.name}
              </span>
              {selectedStyle.id === style.id && (
                <Check className="w-3 h-3 ml-1 inline-block" />
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}