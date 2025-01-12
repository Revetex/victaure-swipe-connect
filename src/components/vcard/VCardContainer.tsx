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
          // Only apply custom styles when not editing
          fontFamily: !isEditing ? customStyles?.font : undefined,
          color: !isEditing ? customStyles?.textColor : undefined,
        }}
      >
        <div 
          className={cn(
            "rounded-xl p-6",
            // Use default background in editing mode for better visibility
            isEditing ? "bg-card" : ""
          )}
          style={{
            // Only apply custom background when not editing
            backgroundColor: !isEditing ? customStyles?.background : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}