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
  return (
    <div className={cn(
      "relative min-h-screen w-full p-4",
      isEditing ? "bg-background" : ""
    )}>
      <div 
        className="space-y-8"
        style={{
          // N'appliquer les styles personnalisés que lorsqu'on n'est pas en mode édition
          fontFamily: !isEditing ? customStyles?.font : undefined,
          color: !isEditing ? customStyles?.textColor : undefined,
        }}
      >
        <div 
          className={cn(
            "rounded-xl p-6",
            isEditing ? "bg-card" : ""
          )}
          style={{
            // N'appliquer le fond personnalisé que lorsqu'on n'est pas en mode édition
            backgroundColor: !isEditing ? customStyles?.background : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}