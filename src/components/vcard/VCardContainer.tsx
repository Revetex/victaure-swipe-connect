import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useVCardStyle } from "./VCardStyleContext";

interface VCardContainerProps {
  children: React.ReactNode;
  isEditing?: boolean;
  customStyles?: {
    font?: string | null;
    background?: string | null;
    textColor?: string | null;
  };
  isCVView?: boolean;
}

export function VCardContainer({ 
  children, 
  isEditing,
  customStyles,
  isCVView = false
}: VCardContainerProps) {
  const { selectedStyle } = useVCardStyle();

  const containerStyle = {
    fontFamily: customStyles?.font || selectedStyle.font,
    backgroundColor: customStyles?.background || selectedStyle.colors.background,
    color: customStyles?.textColor || selectedStyle.colors.text.primary,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative min-h-screen w-full transition-colors duration-300",
        isEditing && "pb-32",
        isCVView && "max-w-4xl mx-auto"
      )}
      style={containerStyle}
    >
      {children}
    </motion.div>
  );
}