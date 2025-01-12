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
      "relative min-h-screen w-full p-2 sm:p-4 md:p-6",
      isEditing ? "bg-background" : ""
    )}>
      <div 
        className="space-y-6 sm:space-y-8"
        style={{
          fontFamily: !isEditing ? customStyles?.font : undefined,
          color: !isEditing ? customStyles?.textColor : undefined,
        }}
      >
        <div 
          className={cn(
            "rounded-xl p-4 sm:p-6 md:p-8",
            isEditing ? "bg-card" : ""
          )}
          style={{
            backgroundColor: !isEditing ? customStyles?.background : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}