import { cn } from "@/lib/utils";
import { StyleOption } from "./types";
import { ReactNode } from "react";

interface VCardContainerProps {
  children: ReactNode;
  isEditing: boolean;
  customStyles?: {
    font?: string | null;
    background?: string | null;
    textColor?: string | null;
  };
  selectedStyle: StyleOption;
}

export function VCardContainer({
  children,
  isEditing,
  customStyles,
  selectedStyle
}: VCardContainerProps) {
  return (
    <div 
      className={cn(
        "relative w-full min-h-screen transition-all duration-300",
        isEditing ? "bg-background" : "bg-gradient-to-br from-background to-background/80",
        selectedStyle.id === "modern" && !isEditing && "bg-gradient-to-br from-gray-900 to-gray-800",
        selectedStyle.id === "minimal" && !isEditing && "bg-white dark:bg-gray-900",
        selectedStyle.id === "creative" && !isEditing && "bg-gradient-to-br from-purple-900 to-indigo-900",
        "pb-24 md:pb-16" // Add padding at the bottom for mobile footer
      )}
      style={{
        fontFamily: customStyles?.font || undefined,
        background: customStyles?.background || undefined,
        color: customStyles?.textColor || undefined,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}