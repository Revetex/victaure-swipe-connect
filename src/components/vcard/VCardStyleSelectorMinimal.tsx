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
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Style</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {styleOptions.map((style, index) => (
          <motion.div
            key={style.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Button
              onClick={() => onStyleSelect(style)}
              className={`relative w-full h-16 rounded-xl transition-all duration-300 ${
                selectedStyle.id === style.id 
                ? 'ring-2 ring-white/50 shadow-lg scale-105' 
                : 'hover:ring-1 hover:ring-white/30 hover:scale-102'
              }`}
              style={{ 
                background: `linear-gradient(135deg, ${style.color}, ${style.secondaryColor})`,
                fontFamily: style.font
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm font-medium drop-shadow-md">
                  {style.name}
                </span>
              </div>
              {selectedStyle.id === style.id && (
                <div className="absolute top-1 right-1">
                  <Check className="w-4 h-4 text-white drop-shadow-md" />
                </div>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}