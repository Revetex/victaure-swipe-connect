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
          isEditing 
            ? 'fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-sm pb-40 pt-4 px-4' 
            : 'relative'
        }`}
        style={{
          fontFamily: selectedStyle.font,
        }}
      >
        <Card 
          className={`relative border shadow-lg overflow-hidden transition-all duration-300 mb-8 ${
            isEditing ? 'mt-4' : ''
          } bg-white dark:bg-gray-900`}
          style={{
            background: `linear-gradient(135deg, ${selectedStyle.colors.primary}05, ${selectedStyle.colors.secondary}10)`,
            borderColor: `${selectedStyle.colors.primary}20`,
            boxShadow: `0 4px 6px -1px ${selectedStyle.colors.primary}10, 0 2px 4px -1px ${selectedStyle.colors.secondary}10`
          }}
        >
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </VCardStyleContext.Provider>
  );
}