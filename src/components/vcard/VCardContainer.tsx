import { ReactNode } from "react";
import { useVCardStyle } from "./VCardStyleContext";

interface VCardContainerProps {
  children: ReactNode;
  isEditing?: boolean;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardContainer({ 
  children, 
  isEditing,
  customStyles 
}: VCardContainerProps) {
  const { selectedStyle } = useVCardStyle();

  const containerStyle = {
    fontFamily: customStyles?.font || selectedStyle.font,
    backgroundColor: customStyles?.background || "transparent",
    color: customStyles?.textColor || selectedStyle.colors.text.primary,
  };

  return (
    <div 
      className={`relative min-h-screen w-full p-4 md:p-8 ${isEditing ? 'editing-mode' : ''}`}
      style={containerStyle}
    >
      {children}
    </div>
  );
}