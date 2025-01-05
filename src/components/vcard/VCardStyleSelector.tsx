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
      className="bg-gradient-to-br from-gray-50/5 to-gray-900/5 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-6 shadow-lg border border-gray-200/10 dark:border-gray-700/30"
    >
      <VCardStyleSelectorMinimal
        selectedStyle={selectedStyle}
        onStyleSelect={onStyleSelect}
        styleOptions={styleOptions}
      />
    </motion.div>
  );
}