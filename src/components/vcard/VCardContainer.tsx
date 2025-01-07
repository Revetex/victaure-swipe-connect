import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { StyleOption } from "./types";
import { VCardStyleContext } from "./VCardStyleContext";

interface VCardContainerProps {
  children: React.ReactNode;
  isEditing: boolean;
  selectedStyle: StyleOption;
}

export function VCardContainer({ children, isEditing, selectedStyle }: VCardContainerProps) {
  return (
    <VCardStyleContext.Provider value={{ selectedStyle, isEditing }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`vcard-root w-full max-w-4xl mx-auto ${
          isEditing ? 'fixed inset-0 z-50 overflow-y-auto pb-20' : 'relative'
        }`}
      >
        {isEditing && (
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm" />
        )}
        
        <Card 
          className={`relative border-none shadow-lg ${
            isEditing 
              ? 'bg-white/10 backdrop-blur-md dark:bg-gray-900/30' 
              : selectedStyle.bgGradient
          } ${selectedStyle.borderStyle}`}
          style={{
            fontFamily: selectedStyle.font,
            color: selectedStyle.colors.text.primary,
            borderColor: `${selectedStyle.color}40`,
            background: isEditing 
              ? undefined 
              : `linear-gradient(135deg, ${selectedStyle.colors.primary}10, ${selectedStyle.colors.secondary}20)`,
          }}
        >
          <CardContent 
            className="p-6"
            style={{
              color: selectedStyle.colors.text.primary
            }}
          >
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </VCardStyleContext.Provider>
  );
}