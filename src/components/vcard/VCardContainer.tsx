import { cn } from "@/lib/utils";

interface VCardContainerProps {
  children: React.ReactNode;
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
  const containerStyle = {
    fontFamily: customStyles?.font || "inherit",
    backgroundColor: customStyles?.background || undefined,
    color: customStyles?.textColor || undefined,
  };

  return (
    <div
      className={cn(
        "relative min-h-screen w-full p-4 transition-colors",
        isEditing ? "bg-background" : ""
      )}
      style={containerStyle}
    >
      {children}
    </div>
  );
}