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
      "rounded-xl p-4 sm:p-6 md:p-8",
      "transition-all duration-300",
      isEditing ? "bg-card shadow-lg border border-border/50" : "",
      !isEditing && customStyles?.background ? "bg-transparent" : ""
    )}>
      <div 
        className="space-y-6 sm:space-y-8"
        style={{
          fontFamily: !isEditing ? customStyles?.font : undefined,
          color: !isEditing ? customStyles?.textColor : undefined,
          backgroundColor: !isEditing ? customStyles?.background : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}