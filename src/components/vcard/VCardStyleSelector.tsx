import { StyleOption } from "./types";
import { VCardStyleSelectorMinimal } from "./VCardStyleSelectorMinimal";
import { motion } from "framer-motion";
import { styleOptions } from "./styles";

interface VCardStyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => void;
  isEditing: boolean;
}

export function VCardStyleSelector({ selectedStyle, onStyleSelect, isEditing }: VCardStyleSelectorProps) {
  if (!isEditing) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-sm rounded-lg p-4 shadow-lg"
    >
      <VCardStyleSelectorMinimal
        selectedStyle={selectedStyle}
        onStyleSelect={onStyleSelect}
        styleOptions={styleOptions}
      />
    </motion.div>
  );
}