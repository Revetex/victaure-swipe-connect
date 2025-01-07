import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface CustomStyles {
  font?: string;
  background?: string;
  textColor?: string;
}

interface VCardContainerProps {
  children: React.ReactNode;
  isEditing: boolean;
  customStyles: CustomStyles;
}

export function VCardContainer({ children, isEditing, customStyles }: VCardContainerProps) {
  const containerStyle = {
    fontFamily: customStyles.font || 'inherit',
    background: customStyles.background || 'white',
    color: customStyles.textColor || 'inherit',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`vcard-root w-full max-w-4xl mx-auto ${
        isEditing 
          ? 'fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-sm pb-40 pt-4 px-4' 
          : 'relative'
      }`}
    >
      <Card 
        className="relative border shadow-lg overflow-hidden transition-all duration-300 mb-8"
        style={containerStyle}
      >
        <CardContent className="p-6">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}