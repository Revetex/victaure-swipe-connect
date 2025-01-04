import { Button } from "@/components/ui/button";
import { StyleOption } from "./types";
import { motion } from "framer-motion";
import { Paintbrush, Sparkles, Zap, Target, Briefcase, Flame, Star, FileText } from "lucide-react";

interface VCardStyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => void;
  styleOptions: StyleOption[];
}

export function VCardStyleSelector({
  selectedStyle,
  onStyleSelect,
  styleOptions,
}: VCardStyleSelectorProps) {
  const getStyleIcon = (displayStyle: string) => {
    switch (displayStyle) {
      case 'modern':
        return <Target className="w-4 h-4" />;
      case 'elegant':
        return <Sparkles className="w-4 h-4" />;
      case 'bold':
        return <Flame className="w-4 h-4" />;
      case 'minimal':
        return <Zap className="w-4 h-4" />;
      case 'creative':
        return <Paintbrush className="w-4 h-4" />;
      case 'professional':
        return <Briefcase className="w-4 h-4" />;
      case 'warm':
        return <Star className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white/90">Choisissez un style</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {styleOptions.map((style) => (
          <motion.div
            key={style.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onStyleSelect(style)}
              className={`w-full h-28 p-4 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                selectedStyle.id === style.id 
                ? 'ring-2 ring-white shadow-lg scale-105' 
                : 'hover:ring-2 hover:ring-white/50'
              } ${style.borderStyle}`}
              style={{ 
                background: `linear-gradient(135deg, ${style.color}, ${style.secondaryColor})`,
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: style.accentGradient,
                }} 
              />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  {getStyleIcon(style.displayStyle)}
                  <span className={`text-white text-sm font-medium font-${style.font}`}>
                    {style.name}
                  </span>
                </div>
                <div className="text-xs text-white/80 mt-2 space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: style.color }} />
                    <span>Principal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: style.secondaryColor }} />
                    <span>Accent</span>
                  </div>
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}